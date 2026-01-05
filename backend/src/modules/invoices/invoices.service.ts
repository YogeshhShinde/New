import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class InvoicesService {
    constructor(private prisma: PrismaService) { }

    // Helper to generate invoice number (Simple auto-increment logic for MVP)
    // In production, this should be more robust (concurrency safe)
    private async generateInvoiceNumber(companyId: string): Promise<string> {
        const count = await this.prisma.invoice.count({ where: { companyId } });
        return `INV-${(count + 1).toString().padStart(4, '0')}`;
    }

    async create(createInvoiceDto: CreateInvoiceDto, companyId: string) {
        const { customerId, items, date, dueDate } = createInvoiceDto;

        // 1. Fetch Company & Customer to determine tax logic
        const company = await this.prisma.company.findUnique({ where: { id: companyId } });
        const customer = await this.prisma.customer.findUnique({ where: { id: customerId } });

        if (!company || !customer) {
            throw new NotFoundException('Company or Customer not found');
        }

        // 2. Fetch all products involved
        const productIds = items.map((i) => i.productId);
        const products = await this.prisma.product.findMany({
            where: { id: { in: productIds }, companyId },
        });
        const productMap = new Map(products.map((p) => [p.id, p]));

        // 3. Calculation Variables
        let subTotal = new Prisma.Decimal(0);
        let totalTaxAmount = new Prisma.Decimal(0);
        const invoiceItemsData: Prisma.InvoiceItemCreateManyInput[] = [];

        // 4. Process Items
        for (const item of items) {
            const product = productMap.get(item.productId);
            if (!product) throw new NotFoundException(`Product ${item.productId} not found`);

            const qty = item.quantity;
            const rate = new Prisma.Decimal(item.unitPrice); // Allow override
            const taxRate = product.taxRate; // 5%, 12%, 18%, etc.

            // Base Amount = Qty * Rate
            const baseAmount = rate.mul(qty);

            // Tax Amount = Base * (Rate / 100)
            const taxAmount = baseAmount.mul(taxRate).div(100);

            // Line Total
            const lineTotal = baseAmount.add(taxAmount);

            // Accumulate
            subTotal = subTotal.add(baseAmount);
            totalTaxAmount = totalTaxAmount.add(taxAmount);

            invoiceItemsData.push({
                invoiceId: '', // Will be ignored/filled by connect or create logic if creating separately,
                // but for nested createMany, we don't need invoiceId in the input type broadly,
                // actually createMany within update/create takes payload without foreign key usually?
                // Wait, Prisma nested createMany doesn't technically exist in strict typing dependent on version in the same way.
                // Better to use a simpler Map or 'any' cast if types are stubborn, but let's try strict.
                // Actually, for nested `createMany`, we just pass the object.
                productId: product.id,
                description: product.name,
                hsnCode: product.hsnCode,
                quantity: qty,
                unitPrice: rate,
                taxRate: taxRate,
                taxAmount: taxAmount,
                total: lineTotal,
            });
        }

        const totalAmount = subTotal.add(totalTaxAmount);

        // 5. Determine Tax Type (IGST or CGST/SGST)
        // const isInterState = company.address?.toLowerCase().includes(customer.state.toLowerCase()) === false;
        // Note: In real app, we compare State Codes strictly.

        return this.prisma.invoice.create({
            data: {
                companyId,
                customerId,
                invoiceNumber: await this.generateInvoiceNumber(companyId),
                date: date ? new Date(date) : new Date(),
                dueDate: dueDate ? new Date(dueDate) : null,
                subTotal,
                taxAmount: totalTaxAmount,
                totalAmount,
                items: {
                    createMany: {
                        data: invoiceItemsData.map(item => ({
                            productId: item.productId,
                            description: item.description,
                            hsnCode: item.hsnCode,
                            quantity: item.quantity,
                            unitPrice: item.unitPrice,
                            taxRate: item.taxRate,
                            taxAmount: item.taxAmount,
                            total: item.total
                        })),
                    },
                },
            },
            include: {
                items: true,
                customer: true,
            },
        });
    }

    findAll(companyId: string) {
        return this.prisma.invoice.findMany({
            where: { companyId },
            include: { customer: true },
            orderBy: { createdAt: 'desc' },
        });
    }

    findOne(id: string, companyId: string) {
        return this.prisma.invoice.findFirst({
            where: { id, companyId },
            include: { items: true, customer: true, payments: true },
        });
    }
}
