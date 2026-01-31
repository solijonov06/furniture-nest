import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { EventService } from './event.service';
import { Event, Events } from '../../libs/dto/event/event';
import { AllEventsInquiry, EventInput, EventsInquiry } from '../../libs/dto/event/event.input';
import { RolesGuard } from '../auth/guards/roles.guard';
import { UseGuards } from '@nestjs/common';
import { MemberType } from '../../libs/enums/member.enum';
import { Roles } from '../auth/decorators/roles.decorator';
import { AuthMember } from '../auth/decorators/authMember.decorator';
import { ObjectId } from 'mongoose';
import { WithoutGuard } from '../auth/guards/without.guard';
import { shapeIntoMongoObjectId } from '../../libs/config';
import { EventUpdate } from '../../libs/dto/event/event.update';

@Resolver()
export class EventResolver {
	constructor(private readonly eventService: EventService) {}

	@Roles(MemberType.ADMIN)
	@UseGuards(RolesGuard)
	@Mutation(() => Event)
	public async createEvent(@Args('input') input: EventInput, @AuthMember('_id') memberId: ObjectId): Promise<Event> {
		console.log('Mutation: createEvent');
		return await this.eventService.createEvent(memberId, input);
	}

	@Query(() => Event)
	public async getEvent(@Args('eventId') input: string): Promise<Event> {
		console.log('Query: getEvent');
		const eventId = shapeIntoMongoObjectId(input);
		return await this.eventService.getEvent(eventId);
	}

	@Query(() => Events)
	public async getEvents(@Args('input') input: EventsInquiry): Promise<Events> {
		console.log('Query: getEvents');
		return await this.eventService.getEvents(input);
	}

	@Query(() => Events)
	public async getUpcomingEvents(@Args('limit', { type: () => Int, nullable: true }) limit?: number): Promise<Events> {
		console.log('Query: getUpcomingEvents');
		return await this.eventService.getUpcomingEvents(limit);
	}

	@Roles(MemberType.ADMIN)
	@UseGuards(RolesGuard)
	@Mutation(() => Event)
	public async updateEvent(
		@Args('input') input: EventUpdate,
		@AuthMember('_id') memberId: ObjectId,
	): Promise<Event> {
		console.log('Mutation: updateEvent');
		input._id = shapeIntoMongoObjectId(input._id);
		return await this.eventService.updateEvent(memberId, input);
	}

	/** ADMIN **/
	@Roles(MemberType.ADMIN)
	@UseGuards(RolesGuard)
	@Query(() => Events)
	public async getAllEventsByAdmin(@Args('input') input: AllEventsInquiry): Promise<Events> {
		console.log('Query: getAllEventsByAdmin');
		return await this.eventService.getAllEventsByAdmin(input);
	}

	@Roles(MemberType.ADMIN)
	@UseGuards(RolesGuard)
	@Mutation(() => Event)
	public async updateEventByAdmin(@Args('input') input: EventUpdate): Promise<Event> {
		console.log('Mutation: updateEventByAdmin');
		input._id = shapeIntoMongoObjectId(input._id);
		return await this.eventService.updateEventByAdmin(input);
	}

	@Roles(MemberType.ADMIN)
	@UseGuards(RolesGuard)
	@Mutation(() => Event)
	public async removeEventByAdmin(@Args('eventId') input: string): Promise<Event> {
		console.log('Mutation: removeEventByAdmin');
		const eventId = shapeIntoMongoObjectId(input);
		return await this.eventService.removeEventByAdmin(eventId);
	}
}


