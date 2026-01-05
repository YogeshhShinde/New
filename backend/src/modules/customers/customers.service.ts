import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';

@Injectable()
export class CustomersService {
    constructor(private prisma: PrismaService) { }

    create(createCustomerDto: CreateCustomerDto, companyId: string) {
        return this.prisma.customer.create({
            data: {
                ...createCustomerDto,
                company: { connect: { id: companyId } },
            },
        });
    }

    findAll(companyId: string) {
        return this.prisma.customer.findMany({
            where: { companyId },
        });
    }

    findOne(id: string, companyId: string) {
        return this.prisma.customer.findFirst({
            where: { id, companyId },
        });
    }

    update(id: string, updateCustomerDto: UpdateCustomerDto, companyId: string) {
        return this.prisma.customer.updateMany({
            where: { id, companyId },
            data: updateCustomerDto,
        });
    }

    remove(id: string, companyId: string) {
        return this.prisma.customer.deleteMany({
            where: { id, companyId },
        });
    }
}
