import { Injectable } from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEventException } from './exception/create-event.exceptions';

interface Resp {
    message: string;
    data?: unknown;
}

@Injectable()
export class UserService {
    constructor(private prismaService: PrismaService) {}

    // Response Handler
    Success(resp: Resp) {
        return {
            success: true,
            message: resp.message,
            data: resp.data,
        };
    }

    async createEvent(createEventDto: CreateEventDto) {
        // check for slug //
        const userBySlug = await this.getEventBySlug(createEventDto.slug);
        if (userBySlug.data != null) {
            throw new CreateEventException('User with same slug exists');
        }
        const tagArray = createEventDto.tags.map((id: string) => ({
            id,
        }));

        const sponsorArray = createEventDto.sponsors.map((id: string) => ({
            id,
        }));

        const response = await this.prismaService.event.create({
            data: {
                ...createEventDto,
                tags: { connect: tagArray },
                sponsors: {
                    connect: sponsorArray,
                },
            },
            include: {
                tags: true,
                sponsors: true,
            },
        });

        return this.Success({
            data: response,
            message: 'Event was created succesfully',
        });
    }

    async getEventBySlug(slug: string) {
        const resp = await this.prismaService.event.findUnique({
            where: {
                slug,
            },
        });
        return this.Success({
            data: resp,
            message: 'Event info was read succesfully',
        });
    }

    async viewAllEvents() {
        const resp = await this.prismaService.event.findMany({});
        return this.Success({
            data: resp,
            message: 'Event info was read succesfully',
        });
    }

    // Get my hackathons

    async viewMyEvents() {
        const resp = await this.prismaService.event.findMany({
            where: {},
        });
        return this.Success({
            data: resp,
            message: 'Event info was read succesfully',
        });
    }
}
