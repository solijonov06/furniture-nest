import { Module } from '@nestjs/common';
import { MemberModule } from './member/member.module';
import { PropertyModule } from './property/property.module';
import { AuthModule } from './auth/auth.module';
import { CommentModule } from './comment/comment.module';
import { LikeModule } from './like/like.module';
import { ViewModule } from './view/view.module';
import { FollowModule } from './follow/follow.module';
import { BoardArticleModule } from './board-article/board-article.module';
import { NoticeModule } from './notice/notice.module';
import { FaqModule } from './faq/faq.module';
import { NotificationModule } from './notification/notification.module';
import { EventModule } from './event/event.module';
import { InquiryModule } from './inquiry/inquiry.module';

@Module({
  imports: [
    MemberModule,
    PropertyModule,
    AuthModule,
    CommentModule,
    LikeModule,
    ViewModule,
    FollowModule,
    BoardArticleModule,
    NoticeModule,
    FaqModule,
    NotificationModule,
    EventModule,
    InquiryModule,
  ],
})
export class ComponentsModule {}
