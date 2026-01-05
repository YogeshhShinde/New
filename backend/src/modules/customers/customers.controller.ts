import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { CustomersService } from './customers.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('customers')
export class CustomersController {
    constructor(private readonly customersService: CustomersService) { }

    @Post()
    create(@Body() createCustomerDto: CreateCustomerDto, @Request() req) {
        // Assuming user has a default company or passing companyId. 
        // For MVP, we might need a way to select company if user has multiple.
        // Simplifying: User -> Company relation. 
        // In real app, we'd extract companyId from Header or User context.
        // Placeholder: req.user.companies[0].companyId or similar logic.
        // FAILURE CASE: User not linked to company.
        // For now, assume companyId is passed in body OR derived. 
        // Let's assume we fetch the first company of the user for this demo.
        const companyId = req.user.companyId; // Needs implementation in JWT strategy to include this
        return this.customersService.create(createCustomerDto, companyId);
    }

    @Get()
    findAll(@Request() req) {
        return this.customersService.findAll(req.user.companyId);
    }

    @Get(':id')
    findOne(@Param('id') id: string, @Request() req) {
        return this.customersService.findOne(id, req.user.companyId);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateCustomerDto: UpdateCustomerDto, @Request() req) {
        return this.customersService.update(id, updateCustomerDto, req.user.companyId);
    }

    @Delete(':id')
    remove(@Param('id') id: string, @Request() req) {
        return this.customersService.remove(id, req.user.companyId);
    }
}
