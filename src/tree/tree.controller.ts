import {
    Controller,
    Post,
    UseInterceptors,
    UploadedFile,
    Body,
    UsePipes,
    ValidationPipe,
    Get,
    Patch,
    Param,
    BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { TreeService } from './tree.service';
import { CloudinaryService } from '../common/cloudinary/cloudinary.service';
import { CreateTreeDto } from './dto/create.tree.dto';
import { UpdateTreeDto } from './dto/update-tree.dto';

@Controller('tree')
export class TreeController {
    constructor(
        private readonly treeService: TreeService,
        private readonly cloudinaryService: CloudinaryService,
    ) { }


    @Patch(':id')
    @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
    async update(
        @Param('id') id: string,
        @Body() updateTreeDto: UpdateTreeDto,
    ) {
        return this.treeService.update(id, updateTreeDto);
    }

    @Post()
    @UseInterceptors(FileInterceptor('image'))
    @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
    async create(
        @UploadedFile() file: Express.Multer.File,
        @Body() createTreeDto: CreateTreeDto,
    ) {
        if (!file) {
            throw new BadRequestException('Image file is required');
        }

        const uploadResult = await this.cloudinaryService.uploadImage(file);

        createTreeDto.metadata.image = uploadResult.secure_url;

        return this.treeService.create(createTreeDto);
    }


    @Get()
    async findAll() {
        return this.treeService.findAll();
    }
}
