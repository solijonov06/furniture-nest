import { registerEnumType } from '@nestjs/graphql';

export enum EventStatus {
	ACTIVE = 'ACTIVE',
	PAUSED = 'PAUSED',
	ENDED = 'ENDED',
	DELETE = 'DELETE',
}
registerEnumType(EventStatus, {
	name: 'EventStatus',
});

export enum EventType {
	EXHIBITION = 'EXHIBITION',
	WORKSHOP = 'WORKSHOP',
	SALE = 'SALE',
	MEETUP = 'MEETUP',
	WEBINAR = 'WEBINAR',
	OTHER = 'OTHER',
}
registerEnumType(EventType, {
	name: 'EventType',
});

