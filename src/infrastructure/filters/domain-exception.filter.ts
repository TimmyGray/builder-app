import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
    Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

/**
 * Translates the domain exceptions (plain Error subclasses raised by the services)
 * into proper HTTP responses, based on their conventional class names:
 *   *NotFoundException        -> 404
 *   *AlreadyExistsException   -> 409
 *   Invalid/Unauthorized      -> 401
 *   *Creation/Update/Deletion -> 500 (deliberately raised, safe to expose)
 *   Internal*ServiceException -> 500
 * Native Nest HttpExceptions (e.g. validation errors) pass through unchanged, and
 * anything unexpected becomes a generic 500 so internals are not leaked.
 */
@Catch()
export class DomainExceptionFilter implements ExceptionFilter {
    private readonly logger = new Logger(DomainExceptionFilter.name);

    catch(exception: unknown, host: ArgumentsHost): void {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        const { status, message } = this.resolve(exception);

        if (status >= HttpStatus.INTERNAL_SERVER_ERROR) {
            this.logger.error(
                `${request.method} ${request.url} -> ${status}`,
                exception instanceof Error ? exception.stack : String(exception),
            );
        }

        response.status(status).json({
            statusCode: status,
            message,
            timestamp: new Date().toISOString(),
            path: request.url,
        });
    }

    private resolve(exception: unknown): { status: number; message: string } {
        if (exception instanceof HttpException) {
            const res = exception.getResponse();
            const raw =
                typeof res === 'string'
                    ? res
                    : ((res as { message?: string | string[] }).message ?? exception.message);
            return { status: exception.getStatus(), message: this.normalize(raw) };
        }

        if (exception instanceof Error) {
            const name = exception.name;
            if (name.endsWith('NotFoundException')) {
                return { status: HttpStatus.NOT_FOUND, message: exception.message };
            }
            if (name.endsWith('AlreadyExistsException')) {
                return { status: HttpStatus.CONFLICT, message: exception.message };
            }
            if (name === 'InvalidCredentialsException' || name === 'UnauthorizedUserException') {
                return { status: HttpStatus.UNAUTHORIZED, message: exception.message };
            }
            if (/(Creation|Update|Deletion)Exception$/.test(name) || name.startsWith('Internal')) {
                return { status: HttpStatus.INTERNAL_SERVER_ERROR, message: exception.message };
            }
        }

        return { status: HttpStatus.INTERNAL_SERVER_ERROR, message: 'Internal server error' };
    }

    private normalize(message: string | string[]): string {
        return Array.isArray(message) ? message.join(', ') : message;
    }
}
