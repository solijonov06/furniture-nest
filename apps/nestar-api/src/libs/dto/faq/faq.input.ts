import { Field, InputType, Int } from '@nestjs/graphql';
import { IsIn, IsNotEmpty, IsOptional, Length, Min } from 'class-validator';
import { ObjectId } from 'mongoose';
import { FaqCategory, FaqStatus } from '../../enums/notice.enum';
import { Direction } from '../../enums/common.enum';
import { availableFaqSorts } from '../../config';

@InputType()
export class FaqInput {
	@IsNotEmpty()
	@Field(() => FaqCategory)
	faqCategory: FaqCategory;

	@IsNotEmpty()
	@Length(3, 200)
	@Field(() => String)
	faqQuestion: string;

	@IsNotEmpty()
	@Length(3, 2000)
	@Field(() => String)
	faqAnswer: string;

	memberId?: ObjectId;
}

@InputType()
class FISearch {
	@IsOptional()
	@Field(() => FaqCategory, { nullable: true })
	faqCategory?: FaqCategory;

	@IsOptional()
	@Field(() => FaqStatus, { nullable: true })
	faqStatus?: FaqStatus;

	@IsOptional()
	@Field(() => String, { nullable: true })
	text?: string;
}

@InputType()
export class FaqsInquiry {
	@IsNotEmpty()
	@Min(1)
	@Field(() => Int)
	page: number;

	@IsNotEmpty()
	@Min(1)
	@Field(() => Int)
	limit: number;

	@IsOptional()
	@IsIn(availableFaqSorts)
	@Field(() => String, { nullable: true })
	sort?: string;

	@IsOptional()
	@Field(() => Direction, { nullable: true })
	direction?: Direction;

	@IsOptional()
	@Field(() => FISearch, { nullable: true })
	search?: FISearch;
}

@InputType()
class AFISearch {
	@IsOptional()
	@Field(() => FaqStatus, { nullable: true })
	faqStatus?: FaqStatus;

	@IsOptional()
	@Field(() => FaqCategory, { nullable: true })
	faqCategory?: FaqCategory;
}

@InputType()
export class AllFaqsInquiry {
	@IsNotEmpty()
	@Min(1)
	@Field(() => Int)
	page: number;

	@IsNotEmpty()
	@Min(1)
	@Field(() => Int)
	limit: number;

	@IsOptional()
	@IsIn(availableFaqSorts)
	@Field(() => String, { nullable: true })
	sort?: string;

	@IsOptional()
	@Field(() => Direction, { nullable: true })
	direction?: Direction;

	@IsOptional()
	@Field(() => AFISearch, { nullable: true })
	search?: AFISearch;
}

