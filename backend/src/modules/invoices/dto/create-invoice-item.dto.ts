import { IsNotEmpty, IsString, IsNumber, Min } from 'class-validator';

export class CreateInvoiceItemDto {
    @IsNotEmpty()
    @IsString()
    productId: string;

    @IsNumber()
    @Min(1)
    quantity: number;

    @IsNumber()
    @Min(0)
    unitPrice: number; // Can be overridden from product price
}
