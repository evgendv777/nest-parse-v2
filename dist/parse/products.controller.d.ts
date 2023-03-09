import { ProductsService } from './products.service';
import { ProductDto } from './dto/product.dto';
export declare class ProductsController {
    private readonly productsService;
    constructor(productsService: ProductsService);
    parse(): Promise<{
        message: string;
    }>;
    getData(url: string): Promise<ProductDto[]>;
    readDataFromFile(filename: string): Promise<ProductDto[]>;
}
