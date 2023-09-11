import {AuthGuard} from './auth.guard';
import {ConfigService} from '@nestjs/config';
import {JwtService} from '@nestjs/jwt';
import {Test} from '@nestjs/testing';
import {UnauthorizedException} from '@nestjs/common';

describe('AuthGuard', () => {
    let guard: AuthGuard;
    let config: ConfigService;
    let service: JwtService;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            controllers: [],
            providers: [
                AuthGuard,
                JwtService,
                {
                    provide: ConfigService,
                    useValue: {
                        get: jest.fn().mockImplementation((key: string) => { return 'secret'; } )
                    }
                },
                {
                    provide: JwtService,
                    useValue: {
                        verifyAsync: jest.fn().mockImplementation(async (token: string, secret: any): Promise<any> => {
                            if (token === secret.secret) {
                               return {name: 'test', role: 'user'};
                            }
                            throw new UnauthorizedException();
                        })
                    }
                }
            ]
        }).compile();

        guard = module.get<AuthGuard>(AuthGuard);
        config = module.get<ConfigService>(ConfigService);
        service = module.get<JwtService>(JwtService);
    });

    it('should be defined', () => {
        expect(guard).toBeDefined();
    });

    describe('Valid token', () => {
        it ('validate with correct token', () => {
            const context = {
                getClass: jest.fn(),
                getHandler: jest.fn(),
                switchToHttp: jest.fn(() => ({
                    getRequest: jest.fn().mockReturnValue({
                        headers: {
                            authorization: 'Bearer secret'
                        }
                    })
                }))
            } as any;
            expect(guard.canActivate(context)).resolves.toEqual(true);
        });
    });

    describe('Invalid token', () => {
        it ('validate with incorrect token', () => {
            const context = {
                getClass: jest.fn(),
                getHandler: jest.fn(),
                switchToHttp: jest.fn(() => ({
                    getRequest: jest.fn().mockReturnValue({
                        headers: {
                            authorization: 'Bearer test'
                        }
                    })
                }))
            } as any;
            expect(guard.canActivate(context)).rejects.toEqual(new UnauthorizedException());
        });
    });

    describe('No token', () => {
        it ('validate request without token', () => {
            const context = {
                getClass: jest.fn(),
                getHandler: jest.fn(),
                switchToHttp: jest.fn(() => ({
                    getRequest: jest.fn().mockReturnValue({
                        headers: {
                            authorization: ''
                        }
                    })
                }))
            } as any;
            expect(guard.canActivate(context)).rejects.toEqual(new UnauthorizedException());
        });
    });

});