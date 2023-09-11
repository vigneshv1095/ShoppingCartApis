import {IsNotEmpty} from 'class-validator';

export class DefaultResponse {
    public success: boolean;
    public data: any;
}

export class UpdateStockRequest {
    @IsNotEmpty()
    public id: number;

    @IsNotEmpty()
    public stock: boolean;
}

export class CreateItemRequest {
    @IsNotEmpty()
    public name: string;

    @IsNotEmpty()
    public price: number;
}