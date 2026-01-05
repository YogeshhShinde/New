import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
    constructor(private prisma: PrismaService) { }

    create(createProductDto: CreateProductDto, companyId: string) {
        return this.prisma.product.create({
            data: {
                ...createProductDto,
                company: { connect: { id: companyId } },
            },
        });
    }

    findAll(companyId: string) {
        return this.prisma.product.findMany({
            where: { companyId },
        });
    }

    findOne(id: string, companyId: string) {
        return this.prisma.product.findFirst({
            where: { id, companyId },
        });
    }

    update(id: string, updateProductDto: UpdateProductDto, companyId: string) {
        return this.prisma.product.updateMany({
            where: { id, companyId },
            data: updateProductDto,
        });
    }

    remove(id: string, companyId: string) {
        return this.prisma.product.deleteMany({
            where: { id, companyId },
        });
    }
}
