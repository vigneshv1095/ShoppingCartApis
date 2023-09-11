import {Body, Controller, HttpCode, HttpStatus, Post, Req, UseGuards} from "@nestjs/common";
import {AuthService} from "./auth.service";
import {AuthRequest, DefaultResponse} from "./auth.types";
import {Role} from "../role/role.enum";
import {ConfigService} from "@nestjs/config";


@Controller('auth')
export class AuthController {

    constructor(
        private authService: AuthService,
        private configService: ConfigService
    ) {
    }

    @HttpCode(HttpStatus.CREATED)
    @Post('signup')
    public async signUp(@Req() req: any, @Body() body: AuthRequest): Promise<DefaultResponse> {
        // A basic API key check to create admin. Need to enable some encoding to pass the key over wire.
        const adminKey = req.headers.authorization;
        let role = Role.User;
        if (adminKey && adminKey === this.configService.get('ADMIN_KEY')) {
            role = Role.Admin;
        }
        return {
            success: true,
            data: await this.authService.signUp(body.username, body.password, role)
        }
    }

    @HttpCode(HttpStatus.OK)
    @Post('signin')
    public async signIn(@Body() body: AuthRequest): Promise<DefaultResponse> {
        return {
            success: true,
            data: await this.authService.signIn(body.username, body.password)
        }
    }

}