import { DeleteObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { Upload } from '@aws-sdk/lib-storage'

import {
	BadRequestException,
	Injectable,
	InternalServerErrorException,
} from '@nestjs/common'
import { FileUpload } from 'graphql-upload/processRequest.mjs'
import * as path from 'path'
import { v4 as uuidv4 } from 'uuid'

@Injectable()
export class UploadService {
	private s3: S3Client
	private bucket: string

	// TODO: use ConfigService for env
	constructor() {
		this.bucket = process.env.AWS_BUCKET_NAME!
		this.s3 = new S3Client({
			region: process.env.AWS_S3_REGION!,
			credentials: {
				accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
				secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
			},
		})
	}

	async saveFile(file: FileUpload): Promise<string> {
		const { createReadStream, filename, mimetype } = file
		const id = uuidv4()
		const fileExtension = path.extname(filename)
		const key = `${id}${fileExtension}`

		try {
			// Используем Upload для поддержки потоков
			const parallelUpload = new Upload({
				client: this.s3,
				params: {
					Bucket: this.bucket,
					Key: key,
					Body: createReadStream(),
					ContentType: mimetype,
				},
				queueSize: 4, // сколько потоков одновременно
				partSize: 5 * 1024 * 1024, // размер части (5 МБ)
			})

			await parallelUpload.done()

			// Возвращаем публичный URL файла
			return `${process.env.AWS_PUBLIC_URL}/${key}`
		} catch (error) {
			console.error(error)
			throw new InternalServerErrorException('Failed to upload file to S3')
		}
	}

	async deleteFile(fileUrl: string): Promise<void> {
		try {
			// Извлекаем ключ файла из URL
			const url = new URL(fileUrl)
			const key = url.pathname.slice(1)

			if (!key) throw new BadRequestException('Invalid file URL')

			await this.s3.send(
				new DeleteObjectCommand({
					Bucket: this.bucket,
					Key: key,
				}),
			)
		} catch (error) {
			console.error(error)
			throw new InternalServerErrorException('Failed to delete file from S3')
		}
	}
}
