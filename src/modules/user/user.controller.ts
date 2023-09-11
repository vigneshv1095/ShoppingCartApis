import {Body, Controller, HttpCode, HttpStatus, Post, UseGuards} from '@nestjs/common';
import {AuthGuard} from '../auth/auth.guard';
import {RolesGuard} from '../role/role.guard';
import {Roles} from '../role/role.decorator';
import {Role} from '../role/role.enum';
import {UserService} from './user.service';
import {DefaultResponse, SuspendRequest} from './user.types';
import {ApiTags} from '@nestjs/swagger';

@Controller('user')
export class UserController {

    constructor(
        private userService: UserService
    ) {
    }

    @UseGuards(AuthGuard, RolesGuard)
    @Roles(Role.Admin)
    @ApiTags('Admin')
    @HttpCode(HttpStatus.OK)
    @Post('suspend')
    public async suspendUser(@Body() body: SuspendRequest): Promise<DefaultResponse> {
        return {
            success: true,
            data: await this.userService.toggleSuspend(body.username, body.suspend)
        };
    }

}