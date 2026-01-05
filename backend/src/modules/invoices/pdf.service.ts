import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { renderToStream } from '@react-pdf/renderer';
import React from 'react';
import InvoicePdf from './invoice-pdf.template';

@Injectable()
export class PdfService {
    async generateInvoicePdf(invoice: any, company: any, customer: any): Promise<NodeJS.ReadableStream> {
        try {
            // @ts-ignore
            return await renderToStream(React.createElement(InvoicePdf, { invoice, company, customer }));
        } catch (error) {
            console.error('PDF Generation Error:', error);
            throw new InternalServerErrorException('Could not generate PDF');
        }
    }
}
