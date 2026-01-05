import React from 'react';
import { Page, Text, View, Document, StyleSheet, Font } from '@react-pdf/renderer';

// Define styles
const styles = StyleSheet.create({
    page: {
        fontFamily: 'Helvetica',
        fontSize: 11,
        paddingTop: 30,
        paddingLeft: 40,
        paddingRight: 40,
        lineHeight: 1.5,
        flexDirection: 'column',
    },
    logo: {
        width: 74,
        height: 66,
        marginLeft: 'auto',
        marginRight: 'auto',
    },
    titleContainer: {
        flexDirection: 'row',
        marginTop: 24,
    },
    reportTitle: {
        color: '#000',
        letterSpacing: 2,
        fontSize: 20,
        textAlign: 'center',
        textTransform: 'uppercase',
    },
    invoiceNoContainer: {
        flexDirection: 'row',
        marginTop: 36,
        justifyContent: 'flex-end',
    },
    invoiceDateContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    invoiceLabel: {
        width: 60,
        fontWeight: 'bold',
    },
    headerContainer: {
        marginTop: 36,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    billTo: {
        marginTop: 20,
        paddingBottom: 3,
        fontFamily: 'Helvetica-Bold',
    },
    tableContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 24,
        borderWidth: 1,
        borderColor: '#bff0fd',
    },
    container: {
        flexDirection: 'row',
        borderBottomColor: '#bff0fd',
        backgroundColor: '#bff0fd',
        borderBottomWidth: 1,
        alignItems: 'center',
        height: 24,
        textAlign: 'center',
        fontWeight: 'bold',
        flexGrow: 1,
    },
    row: {
        flexDirection: 'row',
        borderBottomColor: '#bff0fd',
        borderBottomWidth: 1,
        alignItems: 'center',
        height: 24,
        fontWeight: 'bold',
    },
    description: {
        width: '40%',
        borderRightColor: '#bff0fd',
        borderRightWidth: 1,
        textAlign: 'left',
        paddingLeft: 8,
    },
    qty: {
        width: '10%',
        borderRightColor: '#bff0fd',
        borderRightWidth: 1,
        textAlign: 'right',
        paddingRight: 8,
    },
    rate: {
        width: '15%',
        borderRightColor: '#bff0fd',
        borderRightWidth: 1,
        textAlign: 'right',
        paddingRight: 8,
    },
    amount: {
        width: '15%',
        textAlign: 'right',
        paddingRight: 8,
    },
    totalsContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: 10,
    },
});

interface InvoicePdfProps {
    invoice: any;
    company: any;
    customer: any;
}

const InvoicePdf = ({ invoice, company, customer }: InvoicePdfProps) => (
    <Document>
        <Page size="A4" style={styles.page}>
            <View style={styles.titleContainer}>
                <View style={{ width: '100%' }}>
                    <Text style={styles.reportTitle}>{company.name}</Text>
                    <Text style={{ fontSize: 10, textAlign: 'center' }}>{company.address}</Text>
                    <Text style={{ fontSize: 10, textAlign: 'center' }}>GSTIN: {company.gstin}</Text>
                </View>
            </View>

            <View style={styles.headerContainer}>
                <View>
                    <Text style={styles.billTo}>Bill To:</Text>
                    <Text>{customer.name}</Text>
                    <Text>{customer.address}</Text>
                    <Text>GSTIN: {customer.gstin}</Text>
                </View>
                <View>
                    <Text style={styles.billTo}>Invoice Details:</Text>
                    <Text>No: {invoice.invoiceNumber}</Text>
                    <Text>Date: {new Date(invoice.date).toLocaleDateString()}</Text>
                </View>
            </View>

            <View style={styles.tableContainer}>
                <View style={styles.container}>
                    <Text style={styles.description}>Item</Text>
                    <Text style={styles.qty}>Qty</Text>
                    <Text style={styles.rate}>Rate</Text>
                    <Text style={styles.qty}>Tax %</Text>
                    <Text style={styles.amount}>Total</Text>
                </View>

                {invoice.items.map((item: any, i: number) => (
                    <View style={styles.row} key={i}>
                        <Text style={styles.description}>{item.description}</Text>
                        <Text style={styles.qty}>{item.quantity}</Text>
                        <Text style={styles.rate}>{Number(item.unitPrice).toFixed(2)}</Text>
                        <Text style={styles.qty}>{item.taxRate}%</Text>
                        <Text style={styles.amount}>{Number(item.total).toFixed(2)}</Text>
                    </View>
                ))}
            </View>

            <View style={styles.totalsContainer}>
                <Text style={{ fontWeight: 'bold' }}>Grand Total: {Number(invoice.totalAmount).toFixed(2)}</Text>
            </View>
        </Page>
    </Document>
);

export default InvoicePdf;
