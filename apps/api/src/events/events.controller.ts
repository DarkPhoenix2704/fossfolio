import {
    Body,
    Controller,
    Delete,
    FileTypeValidator,
    Get,
    InternalServerErrorException,
    MaxFileSizeValidator,
    NotFoundException,
    Param,
    ParseFilePipe,
    Patch,
    Post,
    Query,
    UploadedFile,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { EventsService } from './events.service';
import { AuthUser } from '../auth/decorators/user.decorator';
import { RbacGuard } from '../organization/guards/rbac-member.guard';
import { CreateEventDto } from './dto/create-events.dto';
import { Roles } from '../organization/decorators/roles.decorator';
import { UpdateEventDto } from './dto/updtate-event.dto';
import { RegisterEventDto } from './dto/register-event.dto';
import { FormPayLoad } from './dto/create-form.dto';
import { ToggleFormPublishStatus } from './dto/publishForm.dto';
import { DeleteEventDto } from './dto/delete-event.dto';
import { RemoveUserDto } from './dto/remove-user.dto';
@Controller('events')
export class EventsController {
    constructor(private readonly events: EventsService) {}

    @Get('/')
    @ApiTags('events')
    @ApiOperation({ summary: 'returns all upcoming events' })
    async getAllEvents() {
        return await this.events.getAllEvents();
    }

    @Get('/:eventId')
    @ApiTags('events')
    @ApiOperation({ summary: 'returns the specific event with slug' })
    async getEventByID(@Param('eventId') id: string) {
        return await this.events.getEventBySlugId(id);
    }

    @Post('/create')
    @ApiOperation({ summary: 'create new events' })
    @ApiTags('events')
    @Roles('ADMIN', 'EDITOR')
    @UseGuards(AuthGuard('jwt'), RbacGuard)
    async createNewEvent(@Body() data: CreateEventDto) {
        return await this.events.createEvent(data);
    }

    @Get('/publish/:orgID/:id')
    @ApiTags('events')
    @ApiOperation({ summary: 'publish event , by doing this we lets public to register for event' })
    @Roles('ADMIN', 'EDITOR')
    @UseGuards(AuthGuard('jwt'), RbacGuard)
    async publishNewEvent(@Param('id') data: string) {
        return await this.events.publishEvent(data);
    }
    @Patch('/edit')
    @ApiOperation({ summary: 'update info of event' })
    @ApiTags('events')
    @Roles('ADMIN', 'EDITOR')
    @UseInterceptors(FileInterceptor('file'))
    @UseGuards(AuthGuard('jwt'), RbacGuard)
    async updateNewEvent(@Body() data: UpdateEventDto) {
        return await this.events.updateEvent(data);
    }

    @Post('/register')
    @ApiTags('events')
    @ApiOperation({ summary: 'Register for specific event' })
    @UseGuards(AuthGuard('jwt'), RbacGuard)
    async registerEvent(@Body() data: RegisterEventDto, @AuthUser() user: User) {
        return await this.events.registerEvent(data.eventId, user.uid);
    }

    @Get('/participants/:orgID/:id')
    @ApiTags('events')
    @Roles('ADMIN', 'EDITOR', 'VIEWER')
    @ApiOperation({ summary: 'Get all participants of events' })
    @UseGuards(AuthGuard('jwt'), RbacGuard)
    async getregisterDParticipants(@Param('id') id: string) {
        return await this.events.getEventParticipants(id);
    }

    @Get('/participants/:orgID/:id/:userId/form')
    @ApiTags('events')
    @Roles('ADMIN', 'EDITOR', 'VIEWER')
    @ApiOperation({ summary: 'Get all the form submissipn from participant' })
    @UseGuards(AuthGuard('jwt'), RbacGuard)
    async getregisterParticipantsFormSubmissions(
        @Param('id') id: string,
        @Param('userId') uid: string,
    ) {
        return await this.events.getregisterParticipantsFormSubmissions(id, uid);
    }

    @Delete('/participants/delete')
    @ApiTags('events')
    @Roles('ADMIN', 'EDITOR')
    @ApiOperation({ summary: 'Remove participant from a event' })
    @UseGuards(AuthGuard('jwt'), RbacGuard)
    async removePartcipent(@Body() data: RemoveUserDto) {
        return await this.events.removeParticipant(data.eventId, data.userId);
    }

    @Get('/status/:id')
    @ApiTags('events')
    @ApiOperation({ summary: 'Get if participant is registerd for event or not' })
    @UseGuards(AuthGuard('jwt'), RbacGuard)
    async getUserEventStatus(@Param('id') slugId: string, @AuthUser() user: User) {
        return await this.events.getEventRegistartionStatus(slugId, user.uid);
    }

    @Get('/stats/:id')
    @ApiTags('events')
    @ApiOperation({ summary: 'Get event stats' })
    @UseGuards(AuthGuard('jwt'), RbacGuard)
    async getEventStats(@Param('id') id: string) {
        return await this.events.getEventStats(id);
    }

    @Post('/form')
    @ApiTags('events')
    @Roles('ADMIN', 'EDITOR')
    @ApiOperation({ summary: 'Create form for each event' })
    @UseGuards(AuthGuard('jwt'), RbacGuard)
    async createForm(@Body() payload: FormPayLoad) {
        return await this.events.createForm(payload);
    }

    @Patch('/edit/cover')
    @Roles('ADMIN', 'EDITOR')
    @ApiTags('events')
    @UseGuards(AuthGuard('jwt'), RbacGuard)
    @UseInterceptors(FileInterceptor('file'))
    @ApiOperation({ summary: 'Upload image for event cover page' })
    async uploadFile(
        @UploadedFile(
            new ParseFilePipe({
                // file size validators
                validators: [
                    new FileTypeValidator({ fileType: '.(png|jpeg|jpg)' }), // support png,jpg,peg
                    new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 4 }), // File size 4 megabytes
                ],
            }),
        )
        file: Express.Multer.File,
        @Query('event') event: string,
    ) {
        return await this.events.uploadEventCover(file, event);
    }

    @Get('/form/:orgID/:eventId')
    @ApiTags('events')
    @Roles('ADMIN', 'EDITOR')
    @ApiOperation({ summary: 'get form schema of a specific event' })
    @UseGuards(AuthGuard('jwt'), RbacGuard)
    async getFormSchema(@Param('eventId') slugId: string) {
        return await this.events.getEventFormScheme(slugId);
    }

    @Post('/form/:eventId')
    @ApiTags('events')
    @ApiOperation({ summary: 'users register form via this route' })
    @UseGuards(AuthGuard('jwt'), RbacGuard)
    async postFormResponse(
        @Param('eventId') eventId: string,
        @Body() data: Record<string, string | Array<string>>,
        @AuthUser() user: User,
    ) {
        try {
            const event = await this.events.getEventById(eventId);

            if (event.maxTicketCount < 1) {
                throw new NotFoundException();
            }
            await this.events.addUserFormSubmission(data, eventId, user.uid);
            return await this.events.registerEvent(event.slug, user.uid);
        } catch (e) {
            if (e instanceof NotFoundException) throw new NotFoundException();

            throw new InternalServerErrorException();
        }
    }

    @Post('/publish/form/:id')
    @ApiTags('events')
    @ApiOperation({ summary: 'publish event , by doing this we lets public to register for event' })
    @Roles('ADMIN', 'EDITOR')
    @UseGuards(AuthGuard('jwt'), RbacGuard)
    async publishForm(@Param('id') data: string, @Body() payload: ToggleFormPublishStatus) {
        return await this.events.toggleFormPublishStatus(data, payload.shouldFormPublish);
    }

    @Get('/ticket/:eventId')
    @ApiTags('events')
    @ApiOperation({ summary: 'return  ticket info' })
    async getTicketInfo(@Param('eventId') eventId: string) {
        return await this.events.getTicketInfo(eventId);
    }

    @Delete('/delete/:id')
    @Roles('ADMIN')
    @ApiTags('events')
    @UseGuards(AuthGuard('jwt'), RbacGuard)
    @ApiOperation({ summary: 'Delete a event using event id' })
    async deleteEvent(@Param('id') eventId: string, @Body() _: DeleteEventDto) {
        return await this.events.deleteEvent(eventId);
    }
}
