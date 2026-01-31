import { Field, InputType, Int } from '@nestjs/graphql';
import { IsEmail, IsEnum, IsNotEmpty, IsOptional, Length, Min } from 'class-validator';
import { InquiryCategory, InquiryStatus } from '../../enums/inquiry.enum';
import { ObjectId } from 'mongoose';
import { Direction } from '../../enums/common.enum';
import { availableInquirySorts } from '../../config';

@InputType()
export class InquiryInput {
	@IsNotEmpty()
	@IsEnum(InquiryCategory)
	@Field(() => InquiryCategory)
	inquiryCategory: InquiryCategory;

	@IsNotEmpty()
	@Length(3, 100)
	@Field(() => String)
	inquirySubject: string;

	@IsNotEmpty()
	@Length(20, 500)
	@Field(() => String)
	inquiryContent: string;

	@IsNotEmpty()
	@IsEmail()
	@Field(() => String)
	inquiryEmail: string;

	@IsOptional()
	@Field(() => String, { nullable: true })
	inquiryPhone?: string;

	memberId?: ObjectId;
}

@InputType()
class InquirySearch {
	@IsOptional()
	@IsEnum(InquiryCategory)
	@Field(() => InquiryCategory, { nullable: true })
	inquiryCategory?: InquiryCategory;

	@IsOptional()
	@IsEnum(InquiryStatus)
	@Field(() => InquiryStatus, { nullable: true })
	inquiryStatus?: InquiryStatus;

	@IsOptional()
	@Field(() => String, { nullable: true })
	text?: string;
}

@InputType()
export class InquiriesInquiry {
	@IsNotEmpty()
	@Min(1)
	@Field(() => Int)
	page: number;

	@IsNotEmpty()
	@Min(1)
	@Field(() => Int)
	limit: number;

	@IsOptional()
	@IsEnum(Direction)
	@Field(() => Direction, { nullable: true })
	direction?: Direction;

	@IsOptional()
	@Field(() => String, { nullable: true })
	sort?: string;

	@IsOptional()
	@Field(() => InquirySearch, { nullable: true })
	search?: InquirySearch;
}

@InputType()
class AllInquiriesSearch {
	@IsOptional()
	@IsEnum(InquiryStatus)
	@Field(() => InquiryStatus, { nullable: true })
	inquiryStatus?: InquiryStatus;

	@IsOptional()
	@IsEnum(InquiryCategory)
	@Field(() => InquiryCategory, { nullable: true })
	inquiryCategory?: InquiryCategory;
}

@InputType()
export class AllInquiriesInquiry {
	@IsNotEmpty()
	@Min(1)
	@Field(() => Int)
	page: number;

	@IsNotEmpty()
	@Min(1)
	@Field(() => Int)
	limit: number;

	@IsOptional()
	@IsEnum(Direction)
	@Field(() => Direction, { nullable: true })
	direction?: Direction;

	@IsOptional()
	@Field(() => String, { nullable: true })
	sort?: string;

	@IsOptional()
	@Field(() => AllInquiriesSearch, { nullable: true })
	search?: AllInquiriesSearch;
}


