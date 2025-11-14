import {
	ArgumentsHost,
	BadRequestException,
	Catch,
	ExceptionFilter,
} from '@nestjs/common'

// Фильтр для перехвата ошибок валидации GraphQL
@Catch(BadRequestException)
export class GraphQLValidationFilter implements ExceptionFilter {
	catch(exception: BadRequestException, host: ArgumentsHost) {
		const response = exception.getResponse()

		// Создаем ошибку в формате, который ожидает ваш formatError
		const graphqlError = new Error('Validation failed')

		;(graphqlError as any).extensions = {
			code: 'BAD_USER_INPUT',
			exception: {
				status: 400,
				response:
					typeof response === 'object' ? response : { message: response },
			},
		}

		return graphqlError
	}
}
