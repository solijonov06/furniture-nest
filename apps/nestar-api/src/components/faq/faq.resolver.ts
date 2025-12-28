import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { FaqService } from './faq.service';
import { Faq, Faqs } from '../../libs/dto/faq/faq';
import { AllFaqsInquiry, FaqInput, FaqsInquiry } from '../../libs/dto/faq/faq.input';
import { RolesGuard } from '../auth/guards/roles.guard';
import { UseGuards } from '@nestjs/common';
import { MemberType } from '../../libs/enums/member.enum';
import { Roles } from '../auth/decorators/roles.decorator';
import { AuthMember } from '../auth/decorators/authMember.decorator';
import { ObjectId } from 'mongoose';
import { WithoutGuard } from '../auth/guards/without.guard';
import { shapeIntoMongoObjectId } from '../../libs/config';
import { FaqUpdate } from '../../libs/dto/faq/faq.update';

@Resolver()
export class FaqResolver {
	constructor(private readonly faqService: FaqService) {}

	@Roles(MemberType.ADMIN)
	@UseGuards(RolesGuard)
	@Mutation(() => Faq)
	public async createFaq(@Args('input') input: FaqInput, @AuthMember('_id') memberId: ObjectId): Promise<Faq> {
		console.log('Mutation: createFaq');
		return await this.faqService.createFaq(memberId, input);
	}

	@Query(() => Faq)
	public async getFaq(@Args('faqId') input: string): Promise<Faq> {
		console.log('Query: getFaq');
		const faqId = shapeIntoMongoObjectId(input);
		return await this.faqService.getFaq(faqId);
	}

	@Query(() => Faqs)
	public async getFaqs(@Args('input') input: FaqsInquiry): Promise<Faqs> {
		console.log('Query: getFaqs');
		return await this.faqService.getFaqs(input);
	}

	@Roles(MemberType.ADMIN)
	@UseGuards(RolesGuard)
	@Mutation(() => Faq)
	public async updateFaq(@Args('input') input: FaqUpdate, @AuthMember('_id') memberId: ObjectId): Promise<Faq> {
		console.log('Mutation: updateFaq');
		input._id = shapeIntoMongoObjectId(input._id);
		return await this.faqService.updateFaq(memberId, input);
	}

	/** ADMIN **/
	@Roles(MemberType.ADMIN)
	@UseGuards(RolesGuard)
	@Query(() => Faqs)
	public async getAllFaqsByAdmin(@Args('input') input: AllFaqsInquiry): Promise<Faqs> {
		console.log('Query: getAllFaqsByAdmin');
		return await this.faqService.getAllFaqsByAdmin(input);
	}

	@Roles(MemberType.ADMIN)
	@UseGuards(RolesGuard)
	@Mutation(() => Faq)
	public async updateFaqByAdmin(@Args('input') input: FaqUpdate): Promise<Faq> {
		console.log('Mutation: updateFaqByAdmin');
		input._id = shapeIntoMongoObjectId(input._id);
		return await this.faqService.updateFaqByAdmin(input);
	}

	@Roles(MemberType.ADMIN)
	@UseGuards(RolesGuard)
	@Mutation(() => Faq)
	public async removeFaqByAdmin(@Args('faqId') input: string): Promise<Faq> {
		console.log('Mutation: removeFaqByAdmin');
		const faqId = shapeIntoMongoObjectId(input);
		return await this.faqService.removeFaqByAdmin(faqId);
	}
}


