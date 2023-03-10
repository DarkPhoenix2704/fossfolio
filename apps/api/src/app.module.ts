import * as Joi from 'joi';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LoggerModule } from 'nestjs-pino';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { AppController } from './app.controller';
import { MailModule } from './mail/mail.module';
import { ProfileModule } from './profile/profile.module';
import { EventModule } from './event/event.module';
import { TeamModule } from './team/team.module';
import { MiscModule } from './misc/misc.module';

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
                SUPERTOKENS_API_BASEPATH: Joi.string(),
                SUPERTOKENS_WEBSITE_BASEPATH: Joi.string(),
                GITHUB_CLIENT_ID: Joi.string(),
                GITHUB_CLIENT_SECRET: Joi.string(),
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
        EventEmitterModule.forRoot(),
        ThrottlerModule.forRoot({
            ttl: 60,
            limit: 150,
        }),
        PrismaModule,
        AuthModule.forRoot({
            connectionURI: process.env.SUPERTOKENS_CONNECTION_URI as string,
            apiKey: process.env.SUPERTOKENS_API_KEY as string,
            appInfo: {
                appName: process.env.SUPERTOKENS_APP_NAME as string,
                apiDomain: process.env.SUPERTOKENS_API_DOMAIN as string,
                websiteDomain: process.env.SUPERTOKENS_WEBSITE_DOMAIN as string,
                apiBasePath: process.env.SUPERTOKENS_API_BASEPATH as string,
                websiteBasePath: process.env.SUPERTOKENS_WEBSITE_BASEPATH as string,
            },
            githubClientId: process.env.GITHUB_CLIENT_ID as string,
            githubClientSecret: process.env.GITHUB_CLIENT_SECRET as string,
            DashboardApiKey: process.env.DASHBOARD_API_KEY as string,
        }),
        MailModule,
        ProfileModule,
        EventModule,
        TeamModule,
        MiscModule,
    ],
    controllers: [AppController],
    providers: [
        {
            provide: APP_GUARD,
            useClass: ThrottlerGuard,
        },
    ],
})
export class AppModule {}
