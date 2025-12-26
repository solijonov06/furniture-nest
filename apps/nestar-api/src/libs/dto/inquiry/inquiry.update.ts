import { Field, InputType } from '@nestjs/graphql';
import { IsEnum, IsNotEmpty, IsOptional, Length } from 'class-validator';
import { InquiryStatus } from '../../enums/inquiry.enum';
import { ObjectId } from 'mongoose';

@InputType()
export class InquiryUpdate {
	@IsNotEmpty()
	@Field(() => String)
	_id: ObjectId;

	@IsOptional()
	@IsEnum(InquiryStatus)
	@Field(() => InquiryStatus, { nullable: true })
	inquiryStatus?: InquiryStatus;

	@IsOptional()
	@Length(10, 1000)
	@Field(() => String, { nullable: true })
	inquiryAnswer?: string;

	answeredBy?: ObjectId;
	answeredAt?: Date;
}

