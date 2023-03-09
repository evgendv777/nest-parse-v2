import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import * as cheerio from 'cheerio';
import * as fs from 'fs';
import * as path from 'path';
import puppeteer from 'puppeteer';
import { ProductDto } from './dto/product.dto';

@Injectable()
export class ProductsService {
	private readonly logger = new Logger(ProductsService.name);
	
	public urls: { url: string; filename: string }[];

	private intervalId: NodeJS.Timeout;

	constructor() {
		this.parseData();
		setInterval(() => {
			this.parseData();
		}, 43200000); // every 12 hours
	}
	
	public async parseData(): Promise<void> {
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
						if (err) throw err;
						this.logger.log(`Data saved to ${filename}`);
					});
				}
			
		} catch (error) {
			this.logger.error(`Error parsing data: ${error.message}`);
		}
	}

	public stopParsing(): void {
		clearInterval(this.intervalId);
	}
	public async readDataFromFile(filename: string): Promise<ProductDto[]> {
		
		const filepath = path.join(__dirname, '..', 'data', `${filename}.txt`);
		try {
		  const data = await fs.promises.readFile(filepath, 'utf8');
		  return JSON.parse(data) as ProductDto[];
		} catch (error) {
		  this.logger.error(`Error reading data: ${error.message}`);
		  throw new NotFoundException('Data not found');
		}
	  }

	public async getData(filename: string): Promise<any> {
		try {
			const filepath = path.join(__dirname, '..', 'data', `${filename}.txt`);
			const data = await fs.promises.readFile(filepath, 'utf8');
			return data;
		} catch (error) {
			this.logger.error(`Error reading data: ${error.message}`);
			throw new Error(`Error reading data: ${error.message}`);
		}
	}

	private async parseWebsite(url: string): Promise<any> {
		const browserFetcher = puppeteer.createBrowserFetcher(); let revisionInfo = await browserFetcher.download('1095492');
		const browser =await puppeteer.launch({
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

		const products: ProductDto[] = [];

		$('.catalog_item_wrapp').each((_, element) => {
			const url = siteUrl + $(element).find('.dark_link').attr('href');
			const title = $(element).find('div.item-title span').text();
			// const price = Number(
			// 	$(element).find('.values_wrapper span.price_value').text().slice(0, 2)
			// );
			const price = Number($(element).find('.price span.price_value').html());
			const img = siteUrl + $(element).find('span img').attr('data-src');


			products.push({ url, title, price, img });
		});

		await browser.close();
		return products;
	}
}
