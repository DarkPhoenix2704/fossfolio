import * as Joi from 'joi';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LoggerModule } from 'nestjs-pino';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { AppController } from './app.controller';
import { UserModule } from './user/user.module';
import { NocoModule } from './noco/noco.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            validationSchema: Joi.object({
                DATABASE_URL: Joi.string(),
                SUPERTOKENS_APP_NAME: Joi.string(),
                SUPERTOKENS_API_KEY: Joi.string(),
                SUPERTOKENS_API_DOMAIN: Joi.string(),
                SUPERTOKENS_WEBSITE_DOMAIN: Joi.string(),
                SUPERTOKENS_CONNECTION_URI: Joi.string(),
                GOOGLE_CLIENT_ID: Joi.string(),
                GOOGLE_CLIENT_SECRET: Joi.string(),
                EMAIL_HOST: Joi.string(),
                EMAIL_USERNAME: Joi.string(),
                EMAIL_PASSWORD: Joi.string(),
                MAIL_FROM: Joi.string(),
                DASHBOARD_API_KEY: Joi.string(),
            }),
            validationOptions: {
                allowUnknown: true,
                abortEarly: true,
            },
        }),
        LoggerModule.forRoot({
            pinoHttp: {
                transport: {
                    target: 'pino-pretty',
                    options: {
                        singleLine: true,
                        colorize: true,
                        translateTime: true,
                        ignore: 'pid,hostname',
                    },
                },
            },
        }),
        PrismaModule,
        AuthModule.forRoot({
            connectionURI: process.env.SUPERTOKENS_CONNECTION_URI as string,
            apiKey: process.env.SUPERTOKENS_API_KEY as string,
            appInfo: {
                appName: process.env.SUPERTOKENS_APP_NAME as string,
                apiDomain: process.env.SUPERTOKENS_API_DOMAIN as string,
                websiteDomain: process.env.SUPERTOKENS_WEBSITE_DOMAIN as string,
            },
            googleClientId: process.env.GOOGLE_CLIENT_ID as string,
            googleClientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
            DashboardApiKey: process.env.DASHBOARD_API_KEY as string,
        }),
        UserModule,
        NocoModule,
    ],
    controllers: [AppController],
    providers: [],
})
export class AppModule {}
