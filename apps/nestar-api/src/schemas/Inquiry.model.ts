import mongoose, { Schema } from 'mongoose';
import { InquiryCategory, InquiryStatus } from '../libs/enums/inquiry.enum';

const InquirySchema = new Schema(
	{
		inquiryCategory: {
			type: String,
			enum: InquiryCategory,
			required: true,
		},

		inquiryStatus: {
			type: String,
			enum: InquiryStatus,
			default: InquiryStatus.PENDING,
		},

		inquirySubject: {
			type: String,
			required: true,
		},

		inquiryContent: {
			type: String,
			required: true,
		},

		inquiryEmail: {
			type: String,
			required: true,
		},

		inquiryPhone: {
			type: String,
			required: false,
		},

		inquiryAnswer: {
			type: String,
			required: false,
		},

		memberId: {
			type: Schema.Types.ObjectId,
			required: false,
			ref: 'Member',
		},

		answeredBy: {
			type: Schema.Types.ObjectId,
			required: false,
			ref: 'Member',
		},

		answeredAt: {
			type: Date,
			required: false,
		},
	},
	{ timestamps: true, collection: 'inquiries' },
);

export default InquirySchema;

