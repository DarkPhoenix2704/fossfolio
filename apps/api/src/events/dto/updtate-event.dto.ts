import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateEventDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    organizationId: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    eventSlug: string;

    @ApiProperty()
    name: string;

    @ApiProperty()
    description?: Record<string, string>;

    @ApiProperty()
    website: string;

    @ApiProperty()
    location: string;

    @ApiProperty()
    lastDate: Date;

    @ApiProperty()
    isPublished: boolean;

    @ApiProperty()
    maxTeamSize: number;

    @ApiProperty()
    minTeamSize: number;

    @ApiProperty()
    isCollegeEvent: boolean;

    @ApiProperty()
    maxTicketCount: number;

    @ApiProperty()
    eventDate: Date;

    @ApiProperty()
    file: string;
}
