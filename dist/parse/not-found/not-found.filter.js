"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotFoundFilter = void 0;
const common_1 = require("@nestjs/common");
let NotFoundFilter = class NotFoundFilter {
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();
        const status = exception instanceof common_1.HttpException ? exception.getStatus() : common_1.HttpStatus.INTERNAL_SERVER_ERROR;
        if (status === common_1.HttpStatus.NOT_FOUND) {
            return response.status(status).json({
                statusCode: status,
                message: `Cannot ${request.method} ${request.url}`,
            });
        }
        else {
            return response.status(status).json({
                statusCode: status,
                message: exception.message,
            });
        }
    }
};
NotFoundFilter = __decorate([
    (0, common_1.Catch)()
], NotFoundFilter);
exports.NotFoundFilter = NotFoundFilter;
//# sourceMappingURL=not-found.filter.js.map