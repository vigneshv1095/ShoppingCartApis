import {IsNotEmpty} from 'class-validator';
import {ApiProperty} from '@nestjs/swagger';

export class DefaultResponse {
    public success: boolean;

    public data: any;
}

export class AuthRequest {
    @ApiProperty()
    @IsNotEmpty()
    public username: string;

    @ApiProperty()
    @IsNotEmpty()
    public password: string;
}