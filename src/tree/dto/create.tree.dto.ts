import { BadRequestException } from '@nestjs/common';
import { Type, Transform } from 'class-transformer';
import {
    IsString,
    IsNotEmpty,
    IsArray,
    ValidateNested,
    IsDateString,
    IsOptional,
} from 'class-validator';

// --- AttributeDto and other sub-DTOs remain the same ---
class AttributeDto {
    @IsString()
    @IsNotEmpty()
    trait_type: string;

    @IsString()
    @IsNotEmpty()
    value: string;
}

class MetadataDto {
    @IsString()
    name: string;

    @IsString()
    description: string;

    @IsString()
    image: string;

    @IsDateString()
    last_update: Date;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => AttributeDto)
    attributes: AttributeDto[];
}

class HistoryDto {
    @IsDateString()
    @IsOptional()
    updated_at?: Date;

    @ValidateNested()
    @Type(() => MetadataDto)
    metadata: MetadataDto;
}


// --- Main DTO with the @Transform decorator ---
export class CreateTreeDto {
    @IsString()
    @IsNotEmpty()
    contractAddress: string;

    @IsString()
    @IsNotEmpty()
    tokenid: string;

    @ValidateNested()
    @Type(() => MetadataDto)
    @Transform(({ value }) => {
        if (typeof value === 'string') {
            try {
                return JSON.parse(value);
            } catch (e) {
                // You can add error handling here if the string is not valid JSON
                throw new BadRequestException('Invalid metadata JSON string');
            }
        }
        return value;
    })
    metadata: MetadataDto;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => HistoryDto)
    @IsOptional()
    @Transform(({ value }) => {
        if (typeof value === 'string') {
            try {
                return JSON.parse(value);
            } catch (e) {
                throw new BadRequestException('Invalid History JSON string');
            }
        }
        return value;
    })
    History?: HistoryDto[];
}
