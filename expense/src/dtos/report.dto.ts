import { Exclude, Expose } from "class-transformer";
import { IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString } from "class-validator";
import { ReportType } from "src/data";


export class CreateReportDto {
    @IsNumber()
    @IsPositive()
    amount: number;
    @IsString()
    @IsNotEmpty()
    source: string;
}

export class UpdateReportDto {
    @IsOptional()
    @IsNumber()
    @IsPositive()
    amount: number;
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    source: string;
}

export class ReportResponseDto {
    id: string;
    source: string;
    amount: number;
    @Exclude()
    createdAt: Date;
    @Exclude()
    updatedAt: Date;
    type: ReportType;

    @Expose({name: "created_at"})
    transformCreatedAt(){
        return this.createdAt;
    }

    constructor(partial: Partial<ReportResponseDto>) {
        Object.assign(this, partial);
    }
}