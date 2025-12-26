import { ApolloDriverConfig } from '@nestjs/apollo'
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { GraphQLModule } from '@nestjs/graphql'

// Application Modules
import {
	ArticleModule,
	AuthModule,
	CategoryModule,
	CommentModule,
	EmailConfirmationModule,
	HealthModule,
	MailModule,
	PasswordRecoveryModule,
	PrismaModule,
	ReactionModule,
	TwoFactorAuthModule,
	UploadModule,
	UserModule,
} from '@/modules'

// Configuration
import { appConfig, graphqlConfig } from '@/core/config'

@Module({
	imports: [
		// Framework Modules
		ConfigModule.forRoot(appConfig),
		GraphQLModule.forRoot<ApolloDriverConfig>(graphqlConfig),

		PrismaModule,
		HealthModule,
		AuthModule,
		UserModule,
		ArticleModule,
		ReactionModule,
		CategoryModule,
		CommentModule,
		UploadModule,
		MailModule,
		EmailConfirmationModule,
		PasswordRecoveryModule,
		TwoFactorAuthModule,
	],
})
export class CoreModule {}
