import { IsArray, IsIn, IsInt, IsNumber, IsOptional, IsPositive, IsString, MinLength } from "class-validator";

export class CreateProductDto {
    @IsString()
    @IsOptional()
    title?: string;

    @IsNumber()
    @IsPositive()
    @IsOptional()
    price?: number;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsString()
    slug?: string;

    @IsNumber()
    @IsOptional()
    @IsPositive()
    @IsInt()
    stock?: number;

    @IsString({
        each: true
    })
    @IsArray()
    sizes:  string[];

    @IsIn(['men', 'women', 'kid', 'unisex'])
    gender: string;

    @IsString({
        each: true
    })
    @IsOptional()
    tags?: string[];
}

