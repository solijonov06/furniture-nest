import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { Notification, Notifications } from '../../libs/dto/notification/notification';
import { NotificationInput, NotificationsInquiry } from '../../libs/dto/notification/notification.input';
import { Direction, Message } from '../../libs/enums/common.enum';
import { NotificationStatus } from '../../libs/enums/notification.enum';
import { T } from '../../libs/types/common';
import { lookupAuthor, lookupReceiver, shapeIntoMongoObjectId } from '../../libs/config';

@Injectable()
export class NotificationService {
	constructor(@InjectModel('Notification') private readonly notificationModel: Model<Notification>) {}

	public async createNotification(input: NotificationInput): Promise<Notification> {
		try {
			const result = await this.notificationModel.create(input);
			return result;
		} catch (err) {
			console.log('Error, Service.model:', err.message);
			throw new BadRequestException(Message.CREATE_FAILED);
		}
	}

	public async getNotifications(memberId: ObjectId, input: NotificationsInquiry): Promise<Notifications> {
		const { notificationType, notificationStatus, notificationGroup } = input.search || {};
		const match: T = { receiverId: memberId };
		const sort: T = { [input?.sort ?? 'createdAt']: input?.direction ?? Direction.DESC };

		if (notificationType) match.notificationType = notificationType;
		if (notificationStatus) match.notificationStatus = notificationStatus;
		if (notificationGroup) match.notificationGroup = notificationGroup;

		console.log('match:', match);

		const result = await this.notificationModel
			.aggregate([
				{ $match: match },
				{ $sort: sort },
				{
					$facet: {
						list: [
							{ $skip: (input.page - 1) * input.limit },
							{ $limit: input.limit },
							lookupAuthor,
							{ $unwind: { path: '$authorData', preserveNullAndEmptyArrays: true } },
						],
						metaCounter: [{ $count: 'total' }],
					},
				},
			])
			.exec();
		if (!result.length) throw new InternalServerErrorException(Message.NO_DATA_FOUND);

		return result[0];
	}

	public async updateNotification(memberId: ObjectId, notificationId: ObjectId): Promise<Notification> {
		const result = await this.notificationModel
			.findOneAndUpdate(
				{
					_id: notificationId,
					receiverId: memberId,
					notificationStatus: NotificationStatus.WAIT,
				},
				{ notificationStatus: NotificationStatus.READ },
				{ new: true },
			)
			.exec();

		if (!result) throw new InternalServerErrorException(Message.UPDATE_FAILED);

		return result;
	}

	public async markAllAsRead(memberId: ObjectId): Promise<boolean> {
		const result = await this.notificationModel
			.updateMany(
				{
					receiverId: memberId,
					notificationStatus: NotificationStatus.WAIT,
				},
				{ notificationStatus: NotificationStatus.READ },
			)
			.exec();

		return result.modifiedCount > 0;
	}

	public async getUnreadCount(memberId: ObjectId): Promise<number> {
		const count = await this.notificationModel
			.countDocuments({
				receiverId: memberId,
				notificationStatus: NotificationStatus.WAIT,
			})
			.exec();

		return count;
	}

	public async deleteNotification(memberId: ObjectId, notificationId: ObjectId): Promise<Notification> {
		const result = await this.notificationModel
			.findOneAndDelete({
				_id: notificationId,
				receiverId: memberId,
			})
			.exec();

		if (!result) throw new InternalServerErrorException(Message.REMOVE_FAILED);

		return result;
	}
}

