import { ProductDto } from './dto/product.dto';
export declare class ProductsService {
    private readonly logger;
    urls: {
        url: string;
        filename: string;
    }[];
    private intervalId;
    constructor();
    parseData(): Promise<void>;
    stopParsing(): void;
    readDataFromFile(filename: string): Promise<ProductDto[]>;
    getData(filename: string): Promise<any>;
    private parseWebsite;
}
