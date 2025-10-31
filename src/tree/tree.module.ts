import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TreeController } from './tree.controller';
import { TreeService } from './tree.service';
import { CloudinaryModule } from '../common/cloudinary/cloudinary.module';
import { TreeSchema } from './schemas/Tress.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: "Tree", schema: TreeSchema }]),
    CloudinaryModule,
  ],
  controllers: [TreeController],
  providers: [TreeService],
})
export class TreeModule { }
