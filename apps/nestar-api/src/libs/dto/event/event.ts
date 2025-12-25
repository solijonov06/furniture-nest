import { Field, Int, ObjectType } from '@nestjs/graphql';
import { ObjectId } from 'mongoose';
import { EventStatus, EventType } from '../../enums/event.enum';
import { Member, TotalCounter } from '../member/member';

@ObjectType()
export class Event {
	@Field(() => String)
	_id: ObjectId;

	@Field(() => EventType)
	eventType: EventType;

	@Field(() => EventStatus)
	eventStatus: EventStatus;

	@Field(() => String)
	eventTitle: string;

	@Field(() => String, { nullable: true })
	eventDesc?: string;

	@Field(() => String)
	eventImage: string;

	@Field(() => String)
	eventLocation: string;

	@Field(() => Date)
	eventStartDate: Date;

	@Field(() => Date)
	eventEndDate: Date;

	@Field(() => String)
	memberId: ObjectId;

	@Field(() => Date)
	createdAt: Date;

	@Field(() => Date)
	updatedAt: Date;

	/** from aggregation **/
	@Field(() => Member, { nullable: true })
	memberData?: Member;
}

@ObjectType()
export class Events {
	@Field(() => [Event])
	list: Event[];

	@Field(() => [TotalCounter], { nullable: true })
	metaCounter: TotalCounter[];
}

