import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateEventDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    organizationId: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty()
    description: JSON;

    @ApiProperty()
    @IsString()
    website: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    location: string;

    @ApiProperty()
    @IsNumber()
    ticketPrice: number;
}
