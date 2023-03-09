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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const not_found_filter_1 = require("./parse/not-found/not-found.filter");
const products_controller_1 = require("./parse/products.controller");
const products_module_1 = require("./parse/products.module");
const products_service_1 = require("./parse/products.service");
let AppModule = class AppModule {
    constructor(productsService) {
        this.productsService = productsService;
    }
    async onApplicationBootstrap() {
        this.productsService.parseData();
    }
};
AppModule = __decorate([
    (0, common_1.Module)({
        imports: [products_module_1.ProductsModule],
        controllers: [products_controller_1.ProductsController],
        providers: [products_service_1.ProductsService, {
                provide: core_1.APP_FILTER,
                useClass: not_found_filter_1.NotFoundFilter,
            }],
    }),
    __metadata("design:paramtypes", [products_service_1.ProductsService])
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map