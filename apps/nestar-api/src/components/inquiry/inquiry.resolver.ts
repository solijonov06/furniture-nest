import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { InquiryService } from './inquiry.service';
import { Inquiry, Inquiries } from '../../libs/dto/inquiry/inquiry';
import { AllInquiriesInquiry, InquiryInput, InquiriesInquiry } from '../../libs/dto/inquiry/inquiry.input';
import { RolesGuard } from '../auth/guards/roles.guard';
import { UseGuards } from '@nestjs/common';
import { MemberType } from '../../libs/enums/member.enum';
import { Roles } from '../auth/decorators/roles.decorator';
import { AuthMember } from '../auth/decorators/authMember.decorator';
import { ObjectId } from 'mongoose';
import { WithoutGuard } from '../auth/guards/without.guard';
import { shapeIntoMongoObjectId } from '../../libs/config';
import { InquiryUpdate } from '../../libs/dto/inquiry/inquiry.update';
import { AuthGuard } from '../auth/guards/auth.guard';

@Resolver()
export class InquiryResolver {
	constructor(private readonly inquiryService: InquiryService) {}

	@UseGuards(WithoutGuard)
	@Mutation(() => Inquiry)
	public async createInquiry(
		@Args('input') input: InquiryInput,
		@AuthMember('_id') memberId: ObjectId,
	): Promise<Inquiry> {
		console.log('Mutation: createInquiry');
		return await this.inquiryService.createInquiry(memberId, input);
	}

	@UseGuards(AuthGuard)
	@Query(() => Inquiry)
	public async getInquiry(@Args('inquiryId') input: string): Promise<Inquiry> {
		console.log('Query: getInquiry');
		const inquiryId = shapeIntoMongoObjectId(input);
		return await this.inquiryService.getInquiry(inquiryId);
	}

	@UseGuards(AuthGuard)
	@Query(() => Inquiries)
	public async getMyInquiries(
		@Args('input') input: InquiriesInquiry,
		@AuthMember('_id') memberId: ObjectId,
	): Promise<Inquiries> {
		console.log('Query: getMyInquiries');
		return await this.inquiryService.getMyInquiries(memberId, input);
	}

	/** ADMIN **/
	@Roles(MemberType.ADMIN)
	@UseGuards(RolesGuard)
	@Query(() => Inquiries)
	public async getAllInquiriesByAdmin(@Args('input') input: AllInquiriesInquiry): Promise<Inquiries> {
		console.log('Query: getAllInquiriesByAdmin');
		return await this.inquiryService.getAllInquiriesByAdmin(input);
	}

	@Roles(MemberType.ADMIN)
	@UseGuards(RolesGuard)
	@Mutation(() => Inquiry)
	public async answerInquiryByAdmin(
		@Args('input') input: InquiryUpdate,
		@AuthMember('_id') memberId: ObjectId,
	): Promise<Inquiry> {
		console.log('Mutation: answerInquiryByAdmin');
		input._id = shapeIntoMongoObjectId(input._id);
		return await this.inquiryService.answerInquiryByAdmin(memberId, input);
	}

	@Roles(MemberType.ADMIN)
	@UseGuards(RolesGuard)
	@Mutation(() => Inquiry)
	public async updateInquiryByAdmin(@Args('input') input: InquiryUpdate): Promise<Inquiry> {
		console.log('Mutation: updateInquiryByAdmin');
		input._id = shapeIntoMongoObjectId(input._id);
		return await this.inquiryService.updateInquiryByAdmin(input);
	}

	@Roles(MemberType.ADMIN)
	@UseGuards(RolesGuard)
	@Mutation(() => Inquiry)
	public async removeInquiryByAdmin(@Args('inquiryId') input: string): Promise<Inquiry> {
		console.log('Mutation: removeInquiryByAdmin');
		const inquiryId = shapeIntoMongoObjectId(input);
		return await this.inquiryService.removeInquiryByAdmin(inquiryId);
	}
}


