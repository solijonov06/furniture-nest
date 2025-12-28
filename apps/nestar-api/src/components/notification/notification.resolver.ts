import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { NotificationService } from './notification.service';
import { Notification, Notifications } from '../../libs/dto/notification/notification';
import { NotificationsInquiry } from '../../libs/dto/notification/notification.input';
import { UseGuards } from '@nestjs/common';
import { AuthMember } from '../auth/decorators/authMember.decorator';
import { ObjectId } from 'mongoose';
import { shapeIntoMongoObjectId } from '../../libs/config';
import { AuthGuard } from '../auth/guards/auth.guard';
import { WithoutGuard } from '../auth/guards/without.guard';

@Resolver()
export class NotificationResolver {
	constructor(private readonly notificationService: NotificationService) {}

	@UseGuards(WithoutGuard)
	@Query(() => Notifications)
	public async getNotifications(
		@Args('input') input: NotificationsInquiry,
		@AuthMember('_id') memberId: ObjectId,
	): Promise<Notifications> {
		console.log('Query: getNotifications, memberId:', memberId);
		// Return empty if not logged in
		if (!memberId) {
			return { list: [], metaCounter: [] };
		}
		try {
			return await this.notificationService.getNotifications(memberId, input);
		} catch (err) {
			console.log('getNotifications error:', err);
			return { list: [], metaCounter: [] };
		}
	}

	@UseGuards(AuthGuard)
	@Mutation(() => Notification)
	public async updateNotification(
		@Args('notificationId') input: string,
		@AuthMember('_id') memberId: ObjectId,
	): Promise<Notification> {
		console.log('Mutation: updateNotification');
		const notificationId = shapeIntoMongoObjectId(input);
		return await this.notificationService.updateNotification(memberId, notificationId);
	}

	@UseGuards(AuthGuard)
	@Mutation(() => Boolean)
	public async markAllNotificationsAsRead(@AuthMember('_id') memberId: ObjectId): Promise<boolean> {
		console.log('Mutation: markAllNotificationsAsRead');
		return await this.notificationService.markAllAsRead(memberId);
	}

	@UseGuards(WithoutGuard)
	@Query(() => Int)
	public async getUnreadNotificationCount(@AuthMember('_id') memberId: ObjectId): Promise<number> {
		console.log('Query: getUnreadNotificationCount, memberId:', memberId);
		// Return 0 if not logged in
		if (!memberId) {
			return 0;
		}
		try {
			return await this.notificationService.getUnreadCount(memberId);
		} catch (err) {
			console.log('getUnreadNotificationCount error:', err);
			return 0;
		}
	}

	@UseGuards(AuthGuard)
	@Mutation(() => Notification)
	public async deleteNotification(
		@Args('notificationId') input: string,
		@AuthMember('_id') memberId: ObjectId,
	): Promise<Notification> {
		console.log('Mutation: deleteNotification');
		const notificationId = shapeIntoMongoObjectId(input);
		return await this.notificationService.deleteNotification(memberId, notificationId);
	}
}

