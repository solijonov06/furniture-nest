import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional, Length } from 'class-validator';
import { ObjectId } from 'mongoose';
import { FaqCategory, FaqStatus } from '../../enums/notice.enum';

@InputType()
export class FaqUpdate {
	@IsNotEmpty()
	@Field(() => String)
	_id: ObjectId;

	@IsOptional()
	@Field(() => FaqCategory, { nullable: true })
	faqCategory?: FaqCategory;

	@IsOptional()
	@Field(() => FaqStatus, { nullable: true })
	faqStatus?: FaqStatus;

	@IsOptional()
	@Length(3, 200)
	@Field(() => String, { nullable: true })
	faqQuestion?: string;

	@IsOptional()
	@Length(3, 2000)
	@Field(() => String, { nullable: true })
	faqAnswer?: string;
}


