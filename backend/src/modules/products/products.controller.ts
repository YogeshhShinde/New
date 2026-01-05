import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('products')
export class ProductsController {
    constructor(private readonly productsService: ProductsService) { }

    @Post()
    create(@Body() createProductDto: CreateProductDto, @Request() req) {
        // Assuming user has companyId attached to req.user (needs strategy update)
        return this.productsService.create(createProductDto, req.user.companyId);
    }

    @Get()
    findAll(@Request() req) {
        return this.productsService.findAll(req.user.companyId);
    }

    @Get(':id')
    findOne(@Param('id') id: string, @Request() req) {
        return this.productsService.findOne(id, req.user.companyId);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto, @Request() req) {
        return this.productsService.update(id, updateProductDto, req.user.companyId);
    }

    @Delete(':id')
    remove(@Param('id') id: string, @Request() req) {
        return this.productsService.remove(id, req.user.companyId);
    }
}
