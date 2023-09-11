import {IsNotEmpty} from 'class-validator';

export class DefaultResponse {
    public success: boolean;
    public data: any;
}

export class SuspendRequest {
    @IsNotEmpty()
    public suspend: boolean;

    @IsNotEmpty()
    public username: string;
}