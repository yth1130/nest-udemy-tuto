import { Injectable, NotFoundException } from '@nestjs/common';
import { PropertyType } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { HomeResponseDto } from './dtos/home.dto';

interface GetHomesParam {
    city?: string;
    price?: {
        gte?: number;
        lte?: number;
    }
    propertyType?: PropertyType;
}

interface CreateHomeParams {
    address:           string;
    numberOfBedrooms:  number;
    numberOfBathrooms: number;
    city:              string;
    price:             number;
    landSize:          number;
    propertyType:      PropertyType;
    images:            { url: string }[];
}
interface UpdateHomeParams {
    address?:           string;
    numberOfBedrooms?:  number;
    numberOfBathrooms?: number;
    city?:              string;
    price?:             number;
    landSize?:          number;
    propertyType?:      PropertyType;
    // images?:            { url: string }[];
}

@Injectable()
export class HomeService {

    constructor(private readonly prismaService: PrismaService) {}
    
    async getHomes(filter: GetHomesParam): Promise<HomeResponseDto[]> {
        const homes = await this.prismaService.home.findMany({
            select: {
                id: true,
                address: true,
                city: true,
                price: true,
                propertyType: true,
                numberOfBathrooms: true,
                numberOfBedrooms: true,
                images: {
                    select: {
                        url: true
                    },
                    take: 1
                }
            },
            // where: {
            //   city: "Seoul",
            //   price: {
            //       gte: 10,
            //       lte: 70
            //   },
            //   propertyType: PropertyType.Residential,
            // }
            where: filter,
        });
        return homes.map((home) => {
            const fetchHome = {...home, image: home.images[0].url}
            delete fetchHome.images;
            return new HomeResponseDto(fetchHome);
        });
    }

    async getHomeById(id: number): Promise<HomeResponseDto> {
        const home = await this.prismaService.home.findFirst({
            where: {
                id
            }
        });
        if (!home)
            throw new NotFoundException();
            
        return new HomeResponseDto(home);
    }

    async createHome({ address, numberOfBathrooms, numberOfBedrooms, city, price, landSize, propertyType, images }: CreateHomeParams, userId: number) {
        const home = await this.prismaService.home.create({
            data: {
                address,
                numberOfBathrooms,
                numberOfBedrooms,
                city,
                landSize,
                propertyType,
                price,
                realtorId: userId,
            }
        })

        const homeImages = images.map((image) => {
            return {...image, homeId: home.id}
        });

        await this.prismaService.image.createMany({ data: homeImages })

        return new HomeResponseDto(home);
    }

    async updateHomeById(id: number, data: UpdateHomeParams) {
        const home = await this.prismaService.home.findUnique({
            where: {
                id
            }
        })

        if (!home) {
            throw new NotFoundException();
        }

        const updatedHome = await this.prismaService.home.update({
            where: {
                id
            },
            data
        })

        return new HomeResponseDto(updatedHome);
    }

    async deleteHomeById(id: number) {
        const images = await this.prismaService.image.deleteMany({
            where: {
                homeId: id,
            }
        });

        const home = await this.prismaService.home.delete({
            where: {
                id
            }
        })

        if (!home) {
            throw new NotFoundException();
        }
    }

    async getRealtorByHomeId(id: number) {
        const home = await this.prismaService.home.findUnique({
            where: {
                id
            },
            select: {
                realtor: {
                    select: {
                        name: true,
                        id: true,
                        email: true,
                        phone: true,
                    }
                }
            }
        });
        if (!home) {
            throw new NotFoundException();
        }

        return home.realtor;
    }
}
