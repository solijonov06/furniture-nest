import { Field, InputType, Int } from "@nestjs/graphql";
import { IsInt, IsNotEmpty,  IsOptional, Length, Min } from 'class-validator';
import { MemberStatus, MemberType } from "../../enums/member.enum";
import type { ObjectId } from "mongoose";
import { FurnitureCondition, PropertyCategory, PropertyLocation, PropertyMaterial, PropertyStatus, PropertyType } from "../../enums/property.enum";


@InputType()
export class PropertyUpdate {
    @IsNotEmpty()
    @Field(() => String)
    _id: ObjectId;
    
    @IsOptional()
    @Field(() => PropertyType, { nullable: true })
    propertyType?: PropertyType;

    @IsOptional()
    @Field(() => PropertyStatus, { nullable: true })
    propertyStatus?: PropertyStatus;

    @IsOptional()
    @Field(() => PropertyLocation, { nullable: true })
    propertyLocation?: PropertyLocation;

    @IsOptional()
    @Length(3,100)
    @Field(() => String, { nullable: true })
    propertyAddress?: string

    @IsOptional()
    @Length(3,100)
    @Field(() => String, { nullable: true })
    propertyTitle?: string  

    @IsOptional()
    @Field(() => Number, { nullable: true })
    propertyPrice?: number

    @IsOptional()
    @Field(() => Number, { nullable: true })
    propertyVolume?: number

    @IsOptional()
    @Field(() => PropertyMaterial, { nullable: true })
    propertyMaterial?: PropertyMaterial

    @IsOptional()
    @Field(() => PropertyCategory, { nullable: true })
    propertyCategory?: PropertyCategory

    @IsOptional()
    @Field(() => FurnitureCondition, { nullable: true })
    furnitureCondition?: FurnitureCondition

    @IsOptional()
    @Field(() => Boolean, { nullable: true })
    deliveryAvailable?: boolean

    @IsOptional()
    @Field(() => [String], { nullable: true })
    propertyImages?: string[]

    @IsOptional()
    @Length(5,100)
    @Field(() => String, { nullable: true })
    propertyDesc?: string

    soldAt?:Date;

    deletedAt?: Date;
}