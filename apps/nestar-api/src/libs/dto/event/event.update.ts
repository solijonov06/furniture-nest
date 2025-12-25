import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional, Length } from 'class-validator';
import { ObjectId } from 'mongoose';
import { EventStatus, EventType } from '../../enums/event.enum';

@InputType()
export class EventUpdate {
	@IsNotEmpty()
	@Field(() => String)
	_id: ObjectId;

	@IsOptional()
	@Field(() => EventType, { nullable: true })
	eventType?: EventType;

	@IsOptional()
	@Field(() => EventStatus, { nullable: true })
	eventStatus?: EventStatus;

	@IsOptional()
	@Length(3, 100)
	@Field(() => String, { nullable: true })
	eventTitle?: string;

	@IsOptional()
	@Length(3, 2000)
	@Field(() => String, { nullable: true })
	eventDesc?: string;

	@IsOptional()
	@Field(() => String, { nullable: true })
	eventImage?: string;

	@IsOptional()
	@Field(() => String, { nullable: true })
	eventLocation?: string;

	@IsOptional()
	@Field(() => Date, { nullable: true })
	eventStartDate?: Date;

	@IsOptional()
	@Field(() => Date, { nullable: true })
	eventEndDate?: Date;
}

