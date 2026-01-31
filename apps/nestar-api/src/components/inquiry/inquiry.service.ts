import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { Inquiry, Inquiries } from '../../libs/dto/inquiry/inquiry';
import { InquiryInput, InquiriesInquiry, AllInquiriesInquiry } from '../../libs/dto/inquiry/inquiry.input';
import { Direction, Message } from '../../libs/enums/common.enum';
import { InquiryStatus } from '../../libs/enums/inquiry.enum';
import { T } from '../../libs/types/common';
import { InquiryUpdate } from '../../libs/dto/inquiry/inquiry.update';
import { lookupMember, shapeIntoMongoObjectId } from '../../libs/config';

@Injectable()
export class InquiryService {
	constructor(@InjectModel('Inquiry') private readonly inquiryModel: Model<Inquiry>) {}

	public async createInquiry(memberId: ObjectId | null, input: InquiryInput): Promise<Inquiry> {
		if (memberId) {
			input.memberId = memberId;
		}
		try {
			const result = await this.inquiryModel.create(input);
			return result;
		} catch (err) {
			console.log('Error, Service.model:', err.message);
			throw new BadRequestException(Message.CREATE_FAILED);
		}
	}

	public async getInquiry(inquiryId: ObjectId): Promise<Inquiry> {
		const search: T = {
			_id: inquiryId,
			inquiryStatus: { $ne: InquiryStatus.DELETE },
		};

		const targetInquiry: Inquiry = await this.inquiryModel.findOne(search).lean().exec();
		if (!targetInquiry) throw new InternalServerErrorException(Message.NO_DATA_FOUND);

		return targetInquiry;
	}

	public async getMyInquiries(memberId: ObjectId, input: InquiriesInquiry): Promise<Inquiries> {
		const { inquiryCategory, inquiryStatus, text } = input.search || {};
		const match: T = { 
			memberId: memberId,
			inquiryStatus: { $ne: InquiryStatus.DELETE } 
		};
		const sort: T = { [input?.sort ?? 'createdAt']: input?.direction ?? Direction.DESC };

		if (inquiryCategory) match.inquiryCategory = inquiryCategory;
		if (inquiryStatus) match.inquiryStatus = inquiryStatus;
		if (text) {
			match.$or = [
				{ inquirySubject: { $regex: new RegExp(text, 'i') } },
				{ inquiryContent: { $regex: new RegExp(text, 'i') } },
			];
		}

		console.log('match:', match);

		const result = await this.inquiryModel
			.aggregate([
				{ $match: match },
				{ $sort: sort },
				{
					$facet: {
						list: [
							{ $skip: (input.page - 1) * input.limit },
							{ $limit: input.limit },
						],
						metaCounter: [{ $count: 'total' }],
					},
				},
			])
			.exec();
		if (!result.length) throw new InternalServerErrorException(Message.NO_DATA_FOUND);

		return result[0];
	}

	/** ADMIN **/
	public async getAllInquiriesByAdmin(input: AllInquiriesInquiry): Promise<Inquiries> {
		const { inquiryStatus, inquiryCategory } = input.search || {};
		const match: T = {};
		const sort: T = { [input?.sort ?? 'createdAt']: input?.direction ?? Direction.DESC };

		if (inquiryStatus) match.inquiryStatus = inquiryStatus;
		if (inquiryCategory) match.inquiryCategory = inquiryCategory;

		const result = await this.inquiryModel
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
							{
								$lookup: {
									from: 'members',
									localField: 'answeredBy',
									foreignField: '_id',
									as: 'answeredByData',
								},
							},
							{ $unwind: { path: '$answeredByData', preserveNullAndEmptyArrays: true } },
						],
						metaCounter: [{ $count: 'total' }],
					},
				},
			])
			.exec();
		if (!result.length) throw new InternalServerErrorException(Message.NO_DATA_FOUND);

		return result[0];
	}

	public async answerInquiryByAdmin(memberId: ObjectId, input: InquiryUpdate): Promise<Inquiry> {
		const { _id, inquiryAnswer, inquiryStatus } = input;

		const updateData: T = {
			...(inquiryStatus && { inquiryStatus }),
		};

		if (inquiryAnswer) {
			updateData.inquiryAnswer = inquiryAnswer;
			updateData.answeredBy = memberId;
			updateData.answeredAt = new Date();
			updateData.inquiryStatus = InquiryStatus.ANSWERED;
		}

		const result = await this.inquiryModel
			.findOneAndUpdate(
				{ _id: _id, inquiryStatus: { $ne: InquiryStatus.DELETE } }, 
				updateData, 
				{ new: true }
			)
			.exec();
		if (!result) throw new InternalServerErrorException(Message.UPDATE_FAILED);

		return result;
	}

	public async updateInquiryByAdmin(input: InquiryUpdate): Promise<Inquiry> {
		const { _id, inquiryStatus } = input;

		const result = await this.inquiryModel
			.findOneAndUpdate({ _id: _id, inquiryStatus: { $ne: InquiryStatus.DELETE } }, input, { new: true })
			.exec();
		if (!result) throw new InternalServerErrorException(Message.UPDATE_FAILED);

		return result;
	}

	public async removeInquiryByAdmin(inquiryId: ObjectId): Promise<Inquiry> {
		const search: T = { _id: inquiryId, inquiryStatus: InquiryStatus.DELETE };
		const result = await this.inquiryModel.findOneAndDelete(search).exec();
		if (!result) throw new InternalServerErrorException(Message.REMOVE_FAILED);

		return result;
	}
}


