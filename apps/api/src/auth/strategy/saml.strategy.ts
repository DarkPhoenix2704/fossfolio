import { MultiSamlStrategy } from 'passport-saml';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { UserService } from '../../user/user.service';
import { PrismaService } from '../../prisma/prisma.service';
import { SamlOptionsCallback } from 'passport-saml/lib/passport-saml/types';
import e from 'express';

@Injectable()
export class SamlStrategy extends PassportStrategy(MultiSamlStrategy, 'saml') {
    constructor(
        private readonly authService: AuthService,
        private readonly usersService: UserService,
        private readonly prismaService: PrismaService,
    ) {
        super({
            passReqToCallback: true,
            getSamlOptions: async (req: e.Request, callback: SamlOptionsCallback) => {
                const issuer = req.query.issuer;

                if (!issuer || typeof issuer !== 'string') {
                    return callback(new Error('Issuer not found'));
                }

                const config = await this.prismaService.samlConfig.findUnique({
                    where: {
                        issuer: issuer,
                    },
                })

                if (!config) {
                    return callback(new Error('SAML config not found'));
                }

                return callback(null, config);
            }

        });
    }
}
