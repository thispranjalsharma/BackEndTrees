import { Type } from 'class-transformer';
import {
    IsString,
    IsArray,
    ValidateNested,
    IsDateString,
    IsOptional,
} from 'class-validator';

// --- DTO for a single attribute (usually replaced entirely, so no need for a partial version) ---
class AttributeDto {
    @IsString()
    trait_type: string;

    @IsString()
    value: string;
}

// --- PARTIAL DTO for the metadata object ---
// All properties are now optional
class UpdateMetadataDto {
    @IsOptional()
    @IsString()
    name?: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsString()
    image?: string;

    @IsOptional()
    @IsDateString()
    last_update?: Date;

    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => AttributeDto)
    attributes?: AttributeDto[];
}

// --- PARTIAL DTO for a history entry ---
class UpdateHistoryDto {
    @IsOptional()
    @IsDateString()
    updated_at?: Date;

    @IsOptional()
    @ValidateNested()
    @Type(() => UpdateMetadataDto) // Use the partial metadata DTO
    metadata?: UpdateMetadataDto;
}


// --- Main DTO for updating a Tree ---
export class UpdateTreeDto {
    @IsOptional()
    @IsString()
    contractAddress?: string;

    @IsOptional()
    @IsString()
    tokenid?: string;

    @IsOptional()
    @ValidateNested() // Still validate if it's provided
    @Type(() => UpdateMetadataDto) // Use the new PARTIAL metadata DTO
    metadata?: UpdateMetadataDto;

    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => UpdateHistoryDto)
    History?: UpdateHistoryDto[];
}

