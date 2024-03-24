import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrgDto } from './dto/create-org.dto';
import { ORG_EXISTS, ORG_NOT_FOUND } from '../error';
import { UpdateOrgDto } from './dto/update-org.dto';
import { Role } from '@prisma/client';

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

    async update(updateOrgDto: UpdateOrgDto) {
        const { organizationId, name } = updateOrgDto;

        const org = await this.prismaService.organization.findUnique({
            where: {
                id: organizationId,
            },
        });

        if (!org) return ORG_NOT_FOUND;

        const updatedOrg = await this.prismaService.organization.update({
            where: {
                id: organizationId,
            },
            data: {
                name,
            },
        });

        return updatedOrg;
    }

    async findOrgsByUser(uid: string) {
        const data = await this.prismaService.organizationMember.findMany({
            where: {
                userUid: uid,
            },
            select: {
                organization: {
                    include: {
                        _count: {
                            select: {
                                members: true,
                                events: true,
                            },
                        },
                    },
                },
                role: true,
            },
        });

        return {
            ok: true,
            message: 'orgs found successfully',
            data,
        };
    }
    async deleteOrg(id: string) {
        await this.prismaService.organization.delete({
            where: {
                id,
            },
        });
        return {
            ok: true,
            message: 'org was deleted successfully',
        };
    }

    /*  
  
  *  if there is only one admin and he is the one leaving the org we should tranfer the org to the first 
     person who joined the org

  *  if the person is the last person to leave the org we should delete the org completly
 
  *  if there is multiple admins just make user leave the org
   
  */

    async leaveOrg(orgId: string, userId: string) {
        try {
            await this.prismaService.organizationMember.delete({
                where: {
                    userUid_organizationId: {
                        userUid: userId,
                        organizationId: orgId,
                    },
                },
            });
            return {
                ok: true,
                message: 'successfully left the organization',
            };
        } catch {
            return {
                ok: false,
                message: 'Unable to leave the org please try again later',
            };
        }
    }

    async getAllEvents(id: string, role: Role) {
        try {
            const event = await this.prismaService.events.findMany({
                where: {
                    organizationId: id,
                },
            });

            return {
                event,
                role,
            };
        } catch (e) {
            return {
                ok: false,
                message: 'could not find the events',
                ERROR: e,
            };
        }
    }

    async getOrgRole(orgId: string, user: string) {
        try {
            return await this.prismaService.organizationMember.findUnique({
                where: {
                    userUid_organizationId: {
                        userUid: user,
                        organizationId: orgId,
                    },
                },
                select: {
                    role: true,
                },
            });
        } catch {}
    }

    async getOrgById(orgId: string) {
        try {
            const data = await this.prismaService.organization.findUnique({
                where: {
                    id: orgId,
                },
            });

            if (!data) {
                throw new NotFoundException();
            }

            return {
                ok: true,
                message: 'org found successfully',
                data,
            };
        } catch (e) {
            if (e instanceof NotFoundException) {
                throw new NotFoundException({
                    ok: false,
                    message: e.message || 'error loading organization',
                });
            }
        }
    }
    async UpdateOrg(id: string, payload: Data) {
        try {
            const data = await this.prismaService.organization.update({
                where: {
                    id,
                },
                data: {
                    name: payload.name,
                    slug: payload.slug,
                },
            });

            if (!data) {
                throw new NotFoundException();
            }
            return {
                ok: true,
                message: 'Org was updated successfully',
                data,
            };
        } catch (e) {
            if (e instanceof NotFoundException) {
                throw new NotFoundException();
            } else {
                return e;
            }
        }
    }

    async getEventsByorg(key: string) {
        try {
            const data = await this.prismaService.organization.findUnique({
                where: {
                    slug: key,
                },
                select: {
                    events: {
                        where: {
                            isPublished: true,
                        },
                    },
                    name: true,
                },
            });
            if (!data) throw new NotFoundException();
            return {
                ok: true,
                message: 'Events found successfully',
                data,
            };
        } catch {
            throw new NotFoundException();
        }
    }
}

type Data = {
    slug: string;
    name: string;
};
