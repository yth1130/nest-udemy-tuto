import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query, UnauthorizedException, UseGuards } from '@nestjs/common';
import { PropertyType, UserType } from '@prisma/client';
import { Roles } from 'src/decorators/roles.decorator';
import { AuthGuards } from 'src/guards/auth.guard';
import { User, UserInfo } from 'src/user/decorators/user.decorator';
import { CreateHomeDto, HomeResponseDto, UpdateHomeDto } from './dtos/home.dto';
import { HomeService } from './home.service';

@Controller('home')
export class HomeController {
    
    constructor(private readonly homeService: HomeService) { }
    
    @Get()
    getHomes(
        @Query('city') city?: string,
        @Query('minPrice') minPrice?: string,
        @Query('maxPrice') maxPrice?: string,
        @Query('propertyType') propertyType?: PropertyType,
    ): Promise<HomeResponseDto[]> {

        console.log(city);

        const price = minPrice || maxPrice ? {
            ...(minPrice && {gte: parseFloat(minPrice)}),
            ...(maxPrice && {lte: parseFloat(maxPrice)}),
        } : undefined;
        

        const filter = {
            ...(city && { city }),
        //   price: {
        //       gte: minPrice,
        //       lte: maxPrice
        //   },
            ...(price && {price}),
            ...(propertyType && {propertyType}),
        }
        
        // console.log({
        //     city,
        //     maxPrice,
        //     minPrice,
        //     propertyType,
        // })
        return this.homeService.getHomes(filter);
    }

    @Get('/:id')
    getHome(@Param('id', ParseIntPipe) id: number): Promise<HomeResponseDto> {
        return this.homeService.getHomeById(id);
    }

    @Roles(UserType.Realtor, UserType.Admin)
    @UseGuards(AuthGuards)
    @Post()
    createHome(@Body() body: CreateHomeDto, @User() user: UserInfo) {
        // return user;
        // return this.homeService.createHome(body, user.id);
        return "Created Home";
    }

    @Put('/:id')
    async updateHome(@Param("id", ParseIntPipe) id: number, @Body() body: UpdateHomeDto, @User() user: UserInfo) {
        const realtor = await this.homeService.getRealtorByHomeId(id);

        if (realtor.id != user.id)
            throw new UnauthorizedException();
        
        return this.homeService.updateHomeById(id, body);
    }

    @Delete("/:id")
    async deleteHome(@Param("id", ParseIntPipe) id: number, @User() user: UserInfo) {
        const realtor = await this.homeService.getRealtorByHomeId(id);

        if (realtor.id != user.id)
            throw new UnauthorizedException();

        return this.homeService.deleteHomeById(id);
    }

}
