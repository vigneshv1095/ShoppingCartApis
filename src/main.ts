import headers, {fastifyHelmet} from 'fastify-helmet';
import * as rTracer from 'cls-rtracer';

import { NestFactory } from '@nestjs/core';
import { RequestMethod, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';

import { AppModule } from './modules/app/app.module';
// tslint:disable-next-line:no-var-requires
const rotatingLogStream = require('file-stream-rotator').getStream(
    {
        filename: '/var/log/nodejs/http-access-%DATE%.log',
        frequency: 'daily',
        verbose: false,
        date_format: 'YYYY-MM-DD',
        max_logs: '10d'
    });

/**
 * The url endpoint for open api ui
 * @type {string}
 */
export const SWAGGER_API_ROOT = 'api/docs';
/**
 * The name of the api
 * @type {string}
 */
export const SWAGGER_API_NAME = 'API';
/**
 * A short description of the api
 * @type {string}
 */
export const SWAGGER_API_DESCRIPTION = 'API Description';
/**
 * Current version of the api
 * @type {string}
 */
export const SWAGGER_API_CURRENT_VERSION = '1.0';

(async () => {
    const app = await NestFactory.create<NestFastifyApplication>(
        AppModule,
        new FastifyAdapter({logger: {
                stream: rotatingLogStream
            }})
    );
    const options = new DocumentBuilder()
        .setTitle(SWAGGER_API_NAME)
        .setDescription(SWAGGER_API_DESCRIPTION)
        .setVersion(SWAGGER_API_CURRENT_VERSION)
        .addBearerAuth()
        .setBasePath(process.env.ROUTE_PREFIX)
        .build();
    // app.enableCors();
    app.register(headers);
    app.register(fastifyHelmet, {
        contentSecurityPolicy: {
            directives: {
                defaultSrc: [`'self'`],
                styleSrc: [`'self'`, `'unsafe-inline'`],
                imgSrc: [`'self'`, 'data:', 'validator.swagger.io'],
                scriptSrc: [`'self'`, `https: 'unsafe-inline'`]
            }
        }
    });
    app.register(fastifyHelmet, {
        contentSecurityPolicy: false
    });
    app.register(rTracer.fastifyPlugin);
    app.useGlobalPipes(new ValidationPipe());
    app.setGlobalPrefix(process.env.ROUTE_PREFIX, {
        exclude: [{ path: '/', method: RequestMethod.GET }]
    });
    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup(SWAGGER_API_ROOT, app, document);

    await app.listen(process.env.PORT, '0.0.0.0');
})();
