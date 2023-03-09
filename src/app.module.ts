// app.module.ts

import { Module, OnApplicationBootstrap } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { NotFoundFilter } from './parse/not-found/not-found.filter';
import { ProductsController } from './parse/products.controller';
import { ProductsModule } from './parse/products.module';
import { ProductsService } from './parse/products.service';

@Module({
	imports: [ProductsModule],
	controllers: [ProductsController],
	providers: [ProductsService, {
		provide: APP_FILTER,
		useClass: NotFoundFilter,
	}],
})
export class AppModule implements OnApplicationBootstrap {
	constructor(private readonly productsService: ProductsService) {}

	async onApplicationBootstrap() {
		this.productsService.parseData();
	}
}
