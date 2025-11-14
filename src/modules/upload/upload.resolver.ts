import { Body } from '@nestjs/common'
import { Args, Mutation, Resolver } from '@nestjs/graphql'
import GraphQLUpload, {
	type FileUpload,
} from 'graphql-upload/GraphQLUpload.mjs'

import { UploadService } from './upload.service'

import { UploadResponse } from './upload-response.model'

@Resolver()
export class UploadResolver {
	constructor(private readonly uploadService: UploadService) {}

	// TODO: Добавить AuthGuard
	@Mutation(() => UploadResponse)
	async uploadFile(
		@Args({ name: 'file', type: () => GraphQLUpload }) file: FileUpload,
	): Promise<UploadResponse> {
		const fileUrl = await this.uploadService.saveFile(file)

		return {
			message: 'File uploaded successfully!',
			url: fileUrl,
		}
	}

	@Mutation(() => UploadResponse)
	async deleteFile(@Body('url') fileUrl: string) {
		await this.uploadService.deleteFile(fileUrl)

		return { message: 'File deleted successfully' }
	}
}
