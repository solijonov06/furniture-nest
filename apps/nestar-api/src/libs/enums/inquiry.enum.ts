import { registerEnumType } from '@nestjs/graphql';

export enum InquiryCategory {
	PRODUCT = 'PRODUCT',
	PAYMENT = 'PAYMENT',
	DELIVERY = 'DELIVERY',
	RETURN = 'RETURN',
	ACCOUNT = 'ACCOUNT',
	OTHER = 'OTHER',
}
registerEnumType(InquiryCategory, {
	name: 'InquiryCategory',
});

export enum InquiryStatus {
	PENDING = 'PENDING',
	ANSWERED = 'ANSWERED',
	CLOSED = 'CLOSED',
	DELETE = 'DELETE',
}
registerEnumType(InquiryStatus, {
	name: 'InquiryStatus',
});


