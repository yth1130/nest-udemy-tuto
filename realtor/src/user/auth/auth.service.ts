import { ConflictException, HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from "bcryptjs";
import * as jwt from 'jsonwebtoken'
import { UserType } from '@prisma/client';

interface SignupParams {
    email: string;
    password: string;
    name: string;
    phone: string;
}

interface SigninParams {
    email: string;
    password: string;
}

@Injectable()
export class AuthService {
    constructor(private readonly prismaService: PrismaService) {}
    async signup({ email, password, name, phone }: SignupParams, userType: UserType) {
        const userExists = await this.prismaService.user.findUnique({
            where: {
                email
            }
        })

        console.log({userExists});
        if (userExists) {
            throw new ConflictException();
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        console.log({hashedPassword});

        const user = await this.prismaService.user.create({
            data: {
                email,
                name,
                phone,
                password: hashedPassword,
                userType
            }
        });

        // const token = await jwt.sign({
        //     name,
        //     id: user.id
        // }, process.env.JSON_TOKEN_KEY, {
        //     expiresIn: 360000,
        // });
        return this.generateJWT(name, user.id);
    }

    async signin({email, password}:SigninParams) {
        const user = await this.prismaService.user.findUnique({
            where: {
                email
            }
        })
        if (!user) {
            throw new HttpException("Invalid cresentials", 400);
        }

        const hashedPassword = user.password;
        const isValidPassword = await bcrypt.compare(password, hashedPassword);
        if (!isValidPassword) {
            throw new HttpException("Invalid cresentials", 400);
        };
       
        return this.generateJWT(user.name, user.id);
    }

    private generateJWT(name: string, id: number) {
        return jwt.sign({
            name,
            id
        }, process.env.JSON_TOKEN_KEY, {
            expiresIn: 360000,
        }); 
    }

    generateProductKey(email: string, userType: UserType) {
        const str = `${email}-${userType}-${process.env.PRODUCT_KEY_SECRET}`;
        return bcrypt.hash(str, 10);
    }
}
