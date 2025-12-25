import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { Event, Events } from '../../libs/dto/event/event';
import { EventInput, EventsInquiry, AllEventsInquiry } from '../../libs/dto/event/event.input';
import { Direction, Message } from '../../libs/enums/common.enum';
import { EventStatus } from '../../libs/enums/event.enum';
import { T } from '../../libs/types/common';
import { EventUpdate } from '../../libs/dto/event/event.update';
import { lookupMember, shapeIntoMongoObjectId } from '../../libs/config';

@Injectable()
export class EventService {
	constructor(@InjectModel('Event') private readonly eventModel: Model<Event>) {}

	public async createEvent(memberId: ObjectId, input: EventInput): Promise<Event> {
		input.memberId = memberId;
		try {
			const result = await this.eventModel.create(input);
			return result;
		} catch (err) {
			console.log('Error, Service.model:', err.message);
			throw new BadRequestException(Message.CREATE_FAILED);
		}
	}

	public async getEvent(eventId: ObjectId): Promise<Event> {
		const search: T = {
			_id: eventId,
			eventStatus: EventStatus.ACTIVE,
		};

		const targetEvent: Event = await this.eventModel.findOne(search).lean().exec();
		if (!targetEvent) throw new InternalServerErrorException(Message.NO_DATA_FOUND);

		return targetEvent;
	}

	public async getEvents(input: EventsInquiry): Promise<Events> {
		const { eventType, eventStatus, text } = input.search || {};
		const match: T = { eventStatus: EventStatus.ACTIVE };
		const sort: T = { [input?.sort ?? 'createdAt']: input?.direction ?? Direction.DESC };

		if (eventType) match.eventType = eventType;
		if (eventStatus) match.eventStatus = eventStatus;
		if (text) match.eventTitle = { $regex: new RegExp(text, 'i') };

		console.log('match:', match);

		const result = await this.eventModel
			.aggregate([
				{ $match: match },
				{ $sort: sort },
				{
					$facet: {
						list: [
							{ $skip: (input.page - 1) * input.limit },
							{ $limit: input.limit },
							lookupMember,
							{ $unwind: { path: '$memberData', preserveNullAndEmptyArrays: true } },
						],
						metaCounter: [{ $count: 'total' }],
					},
				},
			])
			.exec();
		if (!result.length) throw new InternalServerErrorException(Message.NO_DATA_FOUND);

		return result[0];
	}

	public async getUpcomingEvents(limit: number = 6): Promise<Events> {
		const now = new Date();
		const match: T = {
			eventStatus: EventStatus.ACTIVE,
			eventEndDate: { $gte: now },
		};
		const sort: T = { eventStartDate: Direction.ASC };

		const result = await this.eventModel
			.aggregate([
				{ $match: match },
				{ $sort: sort },
				{
					$facet: {
						list: [{ $limit: limit }, lookupMember, { $unwind: { path: '$memberData', preserveNullAndEmptyArrays: true } }],
						metaCounter: [{ $count: 'total' }],
					},
				},
			])
			.exec();
		if (!result.length) throw new InternalServerErrorException(Message.NO_DATA_FOUND);

		return result[0];
	}

	public async updateEvent(memberId: ObjectId, input: EventUpdate): Promise<Event> {
		const { _id, eventStatus } = input;

		const result = await this.eventModel
			.findOneAndUpdate(
				{
					_id: _id,
					memberId: memberId,
					eventStatus: EventStatus.ACTIVE,
				},
				input,
				{ new: true },
			)
			.exec();

		if (!result) throw new InternalServerErrorException(Message.UPDATE_FAILED);

		return result;
	}

	/** ADMIN **/
	public async getAllEventsByAdmin(input: AllEventsInquiry): Promise<Events> {
		const { eventStatus, eventType } = input.search || {};
		const match: T = {};
		const sort: T = { [input?.sort ?? 'createdAt']: input?.direction ?? Direction.DESC };

		if (eventStatus) match.eventStatus = eventStatus;
		if (eventType) match.eventType = eventType;

		const result = await this.eventModel
			.aggregate([
				{ $match: match },
				{ $sort: sort },
				{
					$facet: {
						list: [
							{ $skip: (input.page - 1) * input.limit },
							{ $limit: input.limit },
							lookupMember,
							{ $unwind: { path: '$memberData', preserveNullAndEmptyArrays: true } },
						],
						metaCounter: [{ $count: 'total' }],
					},
				},
			])
			.exec();
		if (!result.length) throw new InternalServerErrorException(Message.NO_DATA_FOUND);

		return result[0];
	}

	public async updateEventByAdmin(input: EventUpdate): Promise<Event> {
		const { _id, eventStatus } = input;

		const result = await this.eventModel
			.findOneAndUpdate({ _id: _id, eventStatus: { $ne: EventStatus.DELETE } }, input, { new: true })
			.exec();
		if (!result) throw new InternalServerErrorException(Message.UPDATE_FAILED);

		return result;
	}

	public async removeEventByAdmin(eventId: ObjectId): Promise<Event> {
		const search: T = { _id: eventId, eventStatus: EventStatus.DELETE };
		const result = await this.eventModel.findOneAndDelete(search).exec();
		if (!result) throw new InternalServerErrorException(Message.REMOVE_FAILED);

		return result;
	}
}

