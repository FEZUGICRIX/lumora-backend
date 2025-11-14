// global-validation.pipe.ts
import {
	ArgumentMetadata,
	BadRequestException,
	Injectable,
	PipeTransform,
} from '@nestjs/common'
import { plainToInstance } from 'class-transformer'
import { validate } from 'class-validator'

// Глобальный Pipe для валидации входящих данных и форматирования ошибок
@Injectable()
export class GlobalValidationPipe implements PipeTransform<any> {
	async transform(value: any, { metatype }: ArgumentMetadata) {
		if (!metatype || this.isPrimitive(metatype)) {
			return value
		}

		const object = plainToInstance(metatype, value)
		const errors = await validate(object, {
			whitelist: true,
			forbidNonWhitelisted: true,
		})

		if (errors.length > 0) {
			const formattedErrors = this.formatErrors(errors)

			// Создаем ошибку в формате, который понимает ваш formatError
			throw new BadRequestException({
				message: 'Validation failed',
				errors: formattedErrors,
			})
		}

		return object
	}

	private isPrimitive(metatype: any): boolean {
		const types = [String, Boolean, Number, Array, Object]
		return types.includes(metatype)
	}

	private formatErrors(errors: any[]) {
		return errors.map(err => ({
			field: err.property,
			messages: Object.values(err.constraints || {}),
		}))
	}
}
