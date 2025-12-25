import { Field, Int, ObjectType } from '@nestjs/graphql';
import { ObjectId } from 'mongoose';
import { FaqCategory, FaqStatus } from '../../enums/notice.enum';
import { Member, TotalCounter } from '../member/member';

@ObjectType()
export class Faq {
	@Field(() => String)
	_id: ObjectId;

	@Field(() => FaqCategory)
	faqCategory: FaqCategory;

	@Field(() => FaqStatus)
	faqStatus: FaqStatus;

	@Field(() => String)
	faqQuestion: string;

	@Field(() => String)
	faqAnswer: string;

	@Field(() => String)
	memberId: ObjectId;

	 @Field(() => Int, { defaultValue: 0 })
  faqViews: number;

	@Field(() => Date)
	createdAt: Date;

	@Field(() => Date)
	updatedAt: Date;

	/** from aggregation **/
	@Field(() => Member, { nullable: true })
	memberData?: Member;
}

@ObjectType()
export class Faqs {
	@Field(() => [Faq])
	list: Faq[];

	@Field(() => [TotalCounter], { nullable: true })
	metaCounter: TotalCounter[];
}

