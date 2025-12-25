import { Field, InputType, Int } from '@nestjs/graphql';
import { IsIn, IsNotEmpty, IsOptional, Length, Min } from 'class-validator';
import { ObjectId } from 'mongoose';
import { EventStatus, EventType } from '../../enums/event.enum';
import { Direction } from '../../enums/common.enum';
import { availableEventSorts } from '../../config';

@InputType()
export class EventInput {
	@IsNotEmpty()
	@Field(() => EventType)
	eventType: EventType;

	@IsNotEmpty()
	@Length(3, 100)
	@Field(() => String)
	eventTitle: string;

	@IsOptional()
	@Length(3, 2000)
	@Field(() => String, { nullable: true })
	eventDesc?: string;

	@IsNotEmpty()
	@Field(() => String)
	eventImage: string;

	@IsNotEmpty()
	@Field(() => String)
	eventLocation: string;

	@IsNotEmpty()
	@Field(() => Date)
	eventStartDate: Date;

	@IsNotEmpty()
	@Field(() => Date)
	eventEndDate: Date;

	memberId?: ObjectId;
}

@InputType()
class EISearch {
	@IsOptional()
	@Field(() => EventType, { nullable: true })
	eventType?: EventType;

	@IsOptional()
	@Field(() => EventStatus, { nullable: true })
	eventStatus?: EventStatus;

	@IsOptional()
	@Field(() => String, { nullable: true })
	text?: string;
}

@InputType()
export class EventsInquiry {
	@IsNotEmpty()
	@Min(1)
	@Field(() => Int)
	page: number;

	@IsNotEmpty()
	@Min(1)
	@Field(() => Int)
	limit: number;

	@IsOptional()
	@IsIn(availableEventSorts)
	@Field(() => String, { nullable: true })
	sort?: string;

	@IsOptional()
	@Field(() => Direction, { nullable: true })
	direction?: Direction;

	@IsOptional()
	@Field(() => EISearch, { nullable: true })
	search?: EISearch;
}

@InputType()
class AEISearch {
	@IsOptional()
	@Field(() => EventStatus, { nullable: true })
	eventStatus?: EventStatus;

	@IsOptional()
	@Field(() => EventType, { nullable: true })
	eventType?: EventType;
}

@InputType()
export class AllEventsInquiry {
	@IsNotEmpty()
	@Min(1)
	@Field(() => Int)
	page: number;

	@IsNotEmpty()
	@Min(1)
	@Field(() => Int)
	limit: number;

	@IsOptional()
	@IsIn(availableEventSorts)
	@Field(() => String, { nullable: true })
	sort?: string;

	@IsOptional()
	@Field(() => Direction, { nullable: true })
	direction?: Direction;

	@IsOptional()
	@Field(() => AEISearch, { nullable: true })
	search?: AEISearch;
}

