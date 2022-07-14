import { PropertyType } from ".prisma/client";
import { Exclude, Expose, Type } from "class-transformer";
import { IsArray, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, ValidateNested } from "class-validator";


export class HomeResponseDto {
    id:                number;
    address:           string;

    numberOfBedrooms:  number;

    @Exclude()
    numberOfBathrooms: number;
    @Expose({name:"numberOfBathr00ms"})
    numberOfBathrooooms() {
        return this.numberOfBathrooms;
    }

    city:              string;

    @Exclude()
    listedDate:        Date;
    @Expose({name:"listedDateeee"})
    listedDateeee() {
        return this.listedDate;
    }
    
    price:             number;

    image:             string;

    @Exclude()
    landSize:          number;
    @Expose({name:"landSize22"})
    landSize11() {
        return this.landSize;
    }
    
    propertyType:      PropertyType;
    @Exclude()
    createdAt:         Date;
    @Exclude()
    updatedAt:         Date;
    @Exclude()
    realtorId:         number;

    constructor(partial: Partial<HomeResponseDto>) {
        Object.assign(this, partial);
    }
}

class Image {
    @IsString()
    @IsNotEmpty()
    url: string;
}

export class CreateHomeDto {

    @IsString()
    @IsNotEmpty()
    address:           string;

    @IsNumber()
    @IsPositive()
    numberOfBedrooms:  number;
    
    @IsNumber()
    @IsPositive()
    numberOfBathrooms: number;
    
    @IsString()
    @IsNotEmpty()
    city:              string;
    
    @IsNumber()
    @IsPositive()
    price:             number;
    
    @IsNumber()
    @IsPositive()
    landSize:          number;

    @IsEnum(PropertyType)
    propertyType:      PropertyType;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => Image)
    images:            Image[];
}

export class UpdateHomeDto {

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    address?:           string;

    @IsOptional()
    @IsNumber()
    @IsPositive()
    numberOfBedrooms?:  number;
    
    @IsOptional()
    @IsNumber()
    @IsPositive()
    numberOfBathrooms?: number;
    
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    city?:              string;
    
    @IsOptional()
    @IsNumber()
    @IsPositive()
    price?:             number;
    
    @IsOptional()
    @IsNumber()
    @IsPositive()
    landSize?:          number;

    @IsOptional()
    @IsEnum(PropertyType)
    propertyType?:      PropertyType;
}