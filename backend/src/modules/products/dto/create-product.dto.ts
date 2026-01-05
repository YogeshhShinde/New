import { IsNotEmpty, IsString, IsOptional, IsNumber, Min } from 'class-validator';

export class CreateProductDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsString()
    hsnCode?: string;

    @IsNumber()
    @Min(0)
    taxRate: number; // 5, 12, 18, 28

    @IsNotEmpty()
    @IsString()
    unit: string; // PCS, KG, etc.

    @IsNumber()
    @Min(0)
    price: number;

    @IsNumber()
    stock: number;
}
