import { SetMetadata } from '@nestjs/common';
import {Role} from "./role.enum";

// Right now only one role is associated with the user. But the current implementation can support multiple roles too.
export const ROLES_KEY = 'role';
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);