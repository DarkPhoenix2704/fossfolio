import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { GithubStrategy } from './strategy/github.strategy';
import { UserModule } from '../user/user.module';
import { PrismaModule } from '../prisma/prisma.module';
import { PassportModule } from '@nestjs/passport';
import { UserService } from '../user/user.service';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategy/jwt.strategy';
import { RefreshStrategy } from './strategy/refresh.strategy';
import { GoogleStrategy } from './strategy/google.strategy';
import { MultiSamlStrategy } from 'passport-saml';

@Module({
    imports: [
        UserModule,
        PrismaModule,
        PassportModule,
        JwtModule.register({
            secret: process.env.JWT_SECRET,
            signOptions: { expiresIn: process.env.ACCESS_TOKEN_VALIDITY },
        }),
    ],
    controllers: [AuthController],
    providers: [
        AuthService,
        GithubStrategy,
        GoogleStrategy,
        MultiSamlStrategy,
        UserService,
        JwtStrategy,
        RefreshStrategy,
    ],
})
export class AuthModule {}
