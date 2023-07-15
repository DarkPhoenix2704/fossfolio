import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateOrgDto } from './dto/create-org.dto';
import { ORG_EXISTS, ORG_NOT_FOUND } from 'src/error';

@Injectable()
export class OrganizationService {
    constructor(private readonly prismaService: PrismaService) {}

    async create(createOrgDto: CreateOrgDto, uid: string) {
        try {
            const { name, slug } = createOrgDto;

            const org = await this.prismaService.organization.create({
                data: {
                    name,
                    slug,
                    members: {
                        create: {
                            role: 'ADMIN',
                            userUid: uid,
                        },
                    },
                },
            });

            return org;
        } catch (error) {
            return ORG_EXISTS;
        }
    }

    async findOrgBySlug(slug: string) {
        const org = await this.prismaService.organization.findUnique({
            where: {
                slug,
            },
        });

        if (org) return org;
        return ORG_NOT_FOUND;
    }
}
