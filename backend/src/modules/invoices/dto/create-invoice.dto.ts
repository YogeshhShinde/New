import { IsNotEmpty, IsString, IsArray, ValidateNested, IsOptional, IsDateString } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateInvoiceItemDto } from './create-invoice-item.dto';

export class CreateInvoiceDto {
    @IsNotEmpty()
    @IsString()
    customerId: string;

    @IsOptional()
    @IsDateString()
    date?: string;

    @IsOptional()
    @IsDateString()
    dueDate?: string;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateInvoiceItemDto)
    items: CreateInvoiceItemDto[];
}
