import { MemberAuthType, MemberStatus, MemberType } from '../../enums/member.enum';
import { Field, Int, ObjectType } from '@nestjs/graphql';
import { ObjectId } from 'mongoose';
import { FurnitureCondition, PropertyCategory, PropertyLocation, PropertyMaterial, PropertyStatus, PropertyType } from '../../enums/property.enum';
import {Member, TotalCounter} from '../../dto/member/member'
import { MeLiked } from '../like/like';

@ObjectType()
export class Property {
    @Field(()=> String)
    _id: ObjectId;

    @Field(()=> PropertyType)
    propertyType: PropertyType;

    @Field(()=> PropertyStatus)
    propertyStatus: PropertyStatus

    @Field(()=> PropertyLocation)
    propertyLocation: PropertyLocation

    @Field(()=> String)
    propertyAddress: string

    @Field(()=> String)
    propertyTitle: string

    @Field(()=> Number)
    propertyPrice: number

    @Field(()=> Number)
    propertyVolume: number

    @Field(()=> PropertyMaterial, {nullable: true})
    propertyMaterial?: PropertyMaterial

    @Field(()=> PropertyCategory, {nullable: true})
    propertyCategory?: PropertyCategory

    @Field(()=> FurnitureCondition, {nullable: true})
    furnitureCondition?: FurnitureCondition

    @Field(()=> Boolean, {nullable: true})
    deliveryAvailable?: boolean

    @Field(()=> Int)
    propertyViews: number

    @Field(()=> Int)
    propertyLikes: number

    @Field(()=> Int)
    propertyComments: number

    @Field(()=> Int)
    propertyRank: number

    @Field(()=> [String])
    propertyImages: string[]

    @Field(()=> String, {nullable: true})
    propertyDesc?: string

    @Field(()=> String)
    memberId: ObjectId;

    @Field(() => Date, {nullable: true})
    soldAt?: Date;

    @Field(() => Date, {nullable: true})
    deletedAt?: Date;

    @Field(() => Date)
    createdAt: Date;

    @Field(() => Date)
    updatedAt: Date;

    //from aggregation
    @Field(()=> Member, {nullable: true})
    memberData?: Member;

    /**from aggregation */
    @Field(()=> [MeLiked], {nullable: true})
    meLiked?: MeLiked[];
}


@ObjectType()
export class Properties{
    @Field(()=>[Property])
    list: Property[];


    @Field(()=>[TotalCounter],{nullable:true})
    metaCounter: TotalCounter[]    
    }