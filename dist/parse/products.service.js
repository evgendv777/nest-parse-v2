"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var ProductsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductsService = void 0;
const common_1 = require("@nestjs/common");
const cheerio = require("cheerio");
const fs = require("fs");
const path = require("path");
const puppeteer_1 = require("puppeteer");
let ProductsService = ProductsService_1 = class ProductsService {
    constructor() {
        this.logger = new common_1.Logger(ProductsService_1.name);
        this.parseData();
        setInterval(() => {
            this.parseData();
        }, 43200000);
    }
    async parseData() {
        try {
            const rootPath = path.resolve(__dirname, '..');
            const urlsFile = fs.readFileSync(path.join(__dirname, '..', 'urls.json'));
            this.urls = JSON.parse(urlsFile.toString());
            for (const url of this.urls) {
                this.logger.log(`Parsing started for ${url.url}`);
                const data = await this.parseWebsite(url.url);
                if (!fs.existsSync(path.join(rootPath, 'data'))) {
                    fs.mkdirSync(path.join(rootPath, 'data'));
                }
                const filename = path.join(rootPath, 'data', `${url.filename}.txt`);
                fs.writeFile(filename, JSON.stringify(data), (err) => {
                    if (err)
                        throw err;
                    this.logger.log(`Data saved to ${filename}`);
                });
            }
        }
        catch (error) {
            this.logger.error(`Error parsing data: ${error.message}`);
        }
    }
    stopParsing() {
        clearInterval(this.intervalId);
    }
    async readDataFromFile(filename) {
        const filepath = path.join(__dirname, '..', 'data', `${filename}.txt`);
        try {
            const data = await fs.promises.readFile(filepath, 'utf8');
            return JSON.parse(data);
        }
        catch (error) {
            this.logger.error(`Error reading data: ${error.message}`);
            throw new common_1.NotFoundException('Data not found');
        }
    }
    async getData(filename) {
        try {
            const filepath = path.join(__dirname, '..', 'data', `${filename}.txt`);
            const data = await fs.promises.readFile(filepath, 'utf8');
            return data;
        }
        catch (error) {
            this.logger.error(`Error reading data: ${error.message}`);
            throw new Error(`Error reading data: ${error.message}`);
        }
    }
    async parseWebsite(url) {
        const browserFetcher = puppeteer_1.default.createBrowserFetcher();
        let revisionInfo = await browserFetcher.download('1095492');
        const browser = await puppeteer_1.default.launch({
            executablePath: revisionInfo.executablePath,
            ignoreDefaultArgs: ['--disable-extensions'],
            headless: true,
            args: ['--no-sandbox', "--disabled-setupid-sandbox"]
        });
        const page = await browser.newPage();
        page.setDefaultNavigationTimeout(0);
        await page.setViewport({ width: 1300, height: 5000 });
        await page.goto(url, { timeout: 90000, waitUntil: 'domcontentloaded' });
        await page.evaluate('window.scrollTo(0, document.body.scrollHeight)');
        const html = await page.content();
        const $ = cheerio.load(html);
        const siteUrl = 'https://tibetan-formula.com';
        const products = [];
        $('.catalog_item_wrapp').each((_, element) => {
            const url = siteUrl + $(element).find('.dark_link').attr('href');
            const title = $(element).find('div.item-title span').text();
            const price = Number($(element).find('.price span.price_value').html());
            const img = siteUrl + $(element).find('span img').attr('data-src');
            products.push({ url, title, price, img });
        });
        await browser.close();
        return products;
    }
};
ProductsService = ProductsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], ProductsService);
exports.ProductsService = ProductsService;
//# sourceMappingURL=products.service.js.map