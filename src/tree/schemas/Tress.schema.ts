import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

// --- Attribute and Metadata sub-schemas remain unchanged ---
@Schema({ _id: false })
class Attribute {
    @Prop()
    trait_type: string;
    @Prop()
    value: string;
}
const AttributeSchema = SchemaFactory.createForClass(Attribute);

@Schema({ _id: false })
class Metadata {
    @Prop()
    name: string;
    @Prop()
    description: string;
    @Prop()
    image: string;
    @Prop()
    last_update: Date;
    @Prop({ type: [AttributeSchema] })
    attributes: Attribute[];
}
const MetadataSchema = SchemaFactory.createForClass(Metadata);

// --- NEW: A specific schema for our history entries ---
@Schema({ _id: false })
class HistoryEntry {
    @Prop({ default: Date.now })
    updated_at: Date;

    @Prop({ type: MetadataSchema }) // Nests the Metadata schema
    metadata: Metadata;
}
const HistoryEntrySchema = SchemaFactory.createForClass(HistoryEntry);

// --- Main Tree Schema ---
export type TreeDocument = Tree & Document;

@Schema({ timestamps: true }) // `timestamps` provides createdAt and updatedAt
export class Tree {
    @Prop({ required: true })
    contractAddress: string;

    @Prop({ required: true, unique: true })
    tokenid: string;

    @Prop({ type: MetadataSchema })
    metadata: Metadata;

    // The History array is now strongly typed
    @Prop({ type: [HistoryEntrySchema] })
    History: HistoryEntry[];

    updatedAt: Date;
    createdAt: Date;
}

export const TreeSchema = SchemaFactory.createForClass(Tree);
