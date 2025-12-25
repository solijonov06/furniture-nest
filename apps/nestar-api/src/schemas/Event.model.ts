import mongoose, { Schema } from 'mongoose';
import { EventStatus, EventType } from '../libs/enums/event.enum';

const EventSchema = new Schema(
	{
		eventType: {
			type: String,
			enum: EventType,
			required: true,
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

		eventDesc: {
			type: String,
		},

		eventImage: {
			type: String,
			required: true,
		},

		eventLocation: {
			type: String,
			required: true,
		},

		eventStartDate: {
			type: Date,
			required: true,
		},

		eventEndDate: {
			type: Date,
			required: true,
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

