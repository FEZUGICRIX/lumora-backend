import {
	registerDecorator,
	ValidationArguments,
	ValidationOptions,
} from 'class-validator'

export function IsTipTapDoc(validationOptions?: ValidationOptions) {
	return function (object: Object, propertyName: string) {
		registerDecorator({
			name: 'isTipTapDoc',
			target: object.constructor,
			propertyName: propertyName,
			constraints: [],
			options: {
				message: `${propertyName} must be a valid TipTap document JSON object (e.g., { "type": "doc" }).`,
				...validationOptions,
			},
			validator: {
				validate(value: any, args: ValidationArguments) {
					// 1. Проверяем, что это объект, а не примитив (string, number, boolean)
					if (typeof value !== 'object' || value === null) {
						return false
					}
					// 2. Проверяем минимальную структуру TipTap (Root node)
					return value.type === 'doc'
				},
			},
		})
	}
}
