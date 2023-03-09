import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class NotFoundFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

    if (status === HttpStatus.NOT_FOUND) {
      return response.status(status).json({
        statusCode: status,
        message: `Cannot ${request.method} ${request.url}`,
      });
    } else {
      return response.status(status).json({
        statusCode: status,
        message: exception.message,
      });
    }
  }
}
