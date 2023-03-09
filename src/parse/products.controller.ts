import { Controller, Get, Param, Post, Body, UseFilters, NotFoundException } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductDto } from './dto/product.dto';

@Controller('products')

export class ProductsController {
	constructor(private readonly productsService: ProductsService) {}

	@Get('parse')
	async parse() {
		this.productsService.parseData();
		return { message: 'Parsing started' };
	}

	@Get(':url')
	async getData(@Param('url') url: string): Promise<ProductDto[]> {
		const data = await this.productsService.getData(url);
		return JSON.parse(data);
	}
	@Get('/:filename')
	async readDataFromFile(
		@Param('filename') filename: string
	): Promise<ProductDto[]> {
		try {
			const data = await this.productsService.readDataFromFile(filename);
			return data;
		} catch (error) {
			throw new NotFoundException('File not found');
		}
	}
}
