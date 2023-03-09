import { OnApplicationBootstrap } from '@nestjs/common';
import { ProductsService } from './parse/products.service';
export declare class AppModule implements OnApplicationBootstrap {
    private readonly productsService;
    constructor(productsService: ProductsService);
    onApplicationBootstrap(): Promise<void>;
}
