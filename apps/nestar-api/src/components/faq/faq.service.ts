import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { Faq, Faqs } from '../../libs/dto/faq/faq';
import { FaqInput, FaqsInquiry, AllFaqsInquiry } from '../../libs/dto/faq/faq.input';
import { Direction, Message } from '../../libs/enums/common.enum';
import { FaqStatus } from '../../libs/enums/notice.enum';
import { T } from '../../libs/types/common';
import { FaqUpdate } from '../../libs/dto/faq/faq.update';
import { lookupMember, shapeIntoMongoObjectId } from '../../libs/config';

@Injectable()
export class FaqService {
	constructor(@InjectModel('Faq') private readonly faqModel: Model<Faq>) {}

	public async createFaq(memberId: ObjectId, input: FaqInput): Promise<Faq> {
		input.memberId = memberId;
		try {
			const result = await this.faqModel.create(input);
			return result;
		} catch (err) {
			console.log('Error, Service.model:', err.message);
			throw new BadRequestException(Message.CREATE_FAILED);
		}
	}

	public async getFaq(faqId: ObjectId): Promise<Faq> {
		const search: T = {
			_id: faqId,
			faqStatus: FaqStatus.ACTIVE,
		};

		const targetFaq: Faq = await this.faqModel.findOne(search).lean().exec();
		if (!targetFaq) throw new InternalServerErrorException(Message.NO_DATA_FOUND);

		return targetFaq;
	}

	public async getFaqs(input: FaqsInquiry): Promise<Faqs> {
		const { faqCategory, faqStatus, text } = input.search || {};
		const match: T = { faqStatus: FaqStatus.ACTIVE };
		const sort: T = { [input?.sort ?? 'createdAt']: input?.direction ?? Direction.DESC };

		if (faqCategory) match.faqCategory = faqCategory;
		if (faqStatus) match.faqStatus = faqStatus;
		if (text) {
			match.$or = [
				{ faqQuestion: { $regex: new RegExp(text, 'i') } },
				{ faqAnswer: { $regex: new RegExp(text, 'i') } },
			];
		}

		console.log('match:', match);

		const result = await this.faqModel
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

	public async updateFaq(memberId: ObjectId, input: FaqUpdate): Promise<Faq> {
		const { _id, faqStatus } = input;

		const result = await this.faqModel
			.findOneAndUpdate(
				{
					_id: _id,
					memberId: memberId,
					faqStatus: FaqStatus.ACTIVE,
				},
				input,
				{ new: true },
			)
			.exec();

		if (!result) throw new InternalServerErrorException(Message.UPDATE_FAILED);

		return result;
	}

	/** ADMIN **/
	public async getAllFaqsByAdmin(input: AllFaqsInquiry): Promise<Faqs> {
		const { faqStatus, faqCategory } = input.search || {};
		const match: T = {};
		const sort: T = { [input?.sort ?? 'createdAt']: input?.direction ?? Direction.DESC };

		if (faqStatus) match.faqStatus = faqStatus;
		if (faqCategory) match.faqCategory = faqCategory;

		const result = await this.faqModel
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

	public async updateFaqByAdmin(input: FaqUpdate): Promise<Faq> {
		const { _id, faqStatus } = input;

		const result = await this.faqModel
			.findOneAndUpdate({ _id: _id, faqStatus: { $ne: FaqStatus.DELETE } }, input, { new: true })
			.exec();
		if (!result) throw new InternalServerErrorException(Message.UPDATE_FAILED);

		return result;
	}

	public async removeFaqByAdmin(faqId: ObjectId): Promise<Faq> {
		const search: T = { _id: faqId, faqStatus: FaqStatus.DELETE };
		const result = await this.faqModel.findOneAndDelete(search).exec();
		if (!result) throw new InternalServerErrorException(Message.REMOVE_FAILED);

		return result;
	}
}

