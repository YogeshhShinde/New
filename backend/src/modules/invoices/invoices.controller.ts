import { Controller, Get, Post, Body, Param, UseGuards, Request, Res, Header } from '@nestjs/common';
import { InvoicesService } from './invoices.service';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PdfService } from './pdf.service';
import type { Response } from 'express';
import { PrismaService } from '../../database/prisma.service';

@UseGuards(JwtAuthGuard)
@Controller('invoices')
export class InvoicesController {
    constructor(
        private readonly invoicesService: InvoicesService,
        private readonly pdfService: PdfService,
        private readonly prisma: PrismaService
    ) { }

    @Post()
    create(@Body() createInvoiceDto: CreateInvoiceDto, @Request() req) {
        return this.invoicesService.create(createInvoiceDto, req.user.companyId);
    }

    @Get()
    findAll(@Request() req) {
        return this.invoicesService.findAll(req.user.companyId);
    }

    @Get(':id')
    findOne(@Param('id') id: string, @Request() req) {
        return this.invoicesService.findOne(id, req.user.companyId);
    }

    @Get(':id/pdf')
    @Header('Content-Type', 'application/pdf')
    async downloadPdf(@Param('id') id: string, @Request() req, @Res() res: Response) {
        const invoice = await this.invoicesService.findOne(id, req.user.companyId);
        if (!invoice) return res.status(404).json({ message: 'Invoice not found' });

        // Fetch missing details for PDF
        const company = await this.prisma.company.findUnique({ where: { id: req.user.companyId } });

        const stream = await this.pdfService.generateInvoicePdf(invoice, company, invoice.customer);
        stream.pipe(res);
    }
}
