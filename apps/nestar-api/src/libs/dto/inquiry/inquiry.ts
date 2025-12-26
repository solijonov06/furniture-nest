import { Field, Int, ObjectType } from '@nestjs/graphql';
import { ObjectId } from 'mongoose';
import { InquiryCategory, InquiryStatus } from '../../enums/inquiry.enum';
import { Member, TotalCounter } from '../member/member';

@ObjectType()
export class Inquiry {
	@Field(() => String)
	_id: ObjectId;

	@Field(() => InquiryCategory)
	inquiryCategory: InquiryCategory;

	@Field(() => InquiryStatus)
	inquiryStatus: InquiryStatus;

	@Field(() => String)
	inquirySubject: string;

	@Field(() => String)
	inquiryContent: string;

	@Field(() => String)
	inquiryEmail: string;

	@Field(() => String, { nullable: true })
	inquiryPhone?: string;

	@Field(() => String, { nullable: true })
	inquiryAnswer?: string;

	@Field(() => String, { nullable: true })
	memberId?: ObjectId;

	@Field(() => String, { nullable: true })
	answeredBy?: ObjectId;

	@Field(() => Date, { nullable: true })
	answeredAt?: Date;

	@Field(() => Date)
	createdAt: Date;

	@Field(() => Date)
	updatedAt: Date;

	/** From aggregation **/
	@Field(() => Member, { nullable: true })
	memberData?: Member;

	@Field(() => Member, { nullable: true })
	answeredByData?: Member;
}

@ObjectType()
export class Inquiries {
	@Field(() => [Inquiry])
	list: Inquiry[];

	@Field(() => [TotalCounter], { nullable: true })
	metaCounter: TotalCounter[];
}

