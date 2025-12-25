import mongoose, { Schema } from 'mongoose';
import { EventStatus, EventType } from '../libs/enums/event.enum';

const EventSchema = new Schema(
	{
		eventType: {
			type: String,
			enum: EventType,
			default: EventType.OTHER,
		},

		eventStatus: {
			type: String,
			enum: EventStatus,
			default: EventStatus.ACTIVE,
		},

		eventTitle: {
			type: String,
			required: true,
		},

		eventCity: {
			type: String,
			required: true,
		},

		eventDescription: {
			type: String,
			required: true,
		},

		eventImage: {
			type: String,
			required: true,
		},

		eventStartDate: {
			type: Date,
		},

		eventEndDate: {
			type: Date,
		},

		eventLocation: {
			type: String,
		},

		eventLink: {
			type: String,
		},

		memberId: {
			type: Schema.Types.ObjectId,
			required: true,
			ref: 'Member',
		},
	},
	{ timestamps: true, collection: 'events' },
);

export default EventSchema;

