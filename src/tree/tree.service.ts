import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Tree, TreeDocument } from './schemas/Tress.schema';
import { CreateTreeDto } from './dto/create.tree.dto';
import { UpdateTreeDto } from './dto/update-tree.dto';
import * as _ from 'lodash'; // A powerful utility for deep merging


@Injectable()
export class TreeService {
    constructor(@InjectModel("Tree") private treeModel: Model<TreeDocument>) { }



    async update(id: string, updateTreeDto: UpdateTreeDto): Promise<Tree> {
        const treeToUpdate = await this.treeModel.findById(id);

        if (!treeToUpdate) {
            throw new NotFoundException(`Tree with ID "${id}" not found`);
        }
        const historyRecord = {
            updated_at: treeToUpdate.updatedAt,
            metadata: _.cloneDeep(treeToUpdate.metadata),
        };

        if (!treeToUpdate.History) {
            treeToUpdate.History = [];
        }
        treeToUpdate.History.push(historyRecord);

        _.merge(treeToUpdate, updateTreeDto);

        return treeToUpdate.save();
    }

    async findAll(): Promise<Tree[]> {
        return this.treeModel.find().exec();
    }

    async create(createTreeDto: CreateTreeDto): Promise<Tree> {
        const newTree = new this.treeModel(createTreeDto);
        return newTree.save();
    }
}
