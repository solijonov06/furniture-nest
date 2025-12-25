import { Field, Int, ObjectType } from '@nestjs/graphql';
import { ObjectId } from 'mongoose';
import { EventStatus, EventType } from '../../enums/event.enum';
import { Member, TotalCounter } from '../member/member';

@ObjectType()
export class Event {
	@Field(() => String)
	_id: ObjectId;

	@Field(() => EventType, { nullable: true })
	eventType?: EventType;

	@Field(() => EventStatus)
	eventStatus: EventStatus;

	@Field(() => String)
	eventTitle: string;

	@Field(() => String)
	eventCity: string;

	@Field(() => String)
	eventDescription: string;

	@Field(() => String)
	eventImage: string;

	@Field(() => Date, { nullable: true })
	eventStartDate?: Date;

	@Field(() => Date, { nullable: true })
	eventEndDate?: Date;

	@Field(() => String, { nullable: true })
	eventLocation?: string;

	@Field(() => String, { nullable: true })
	eventLink?: string;

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

