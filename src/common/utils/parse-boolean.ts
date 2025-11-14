// Utility to parse boolean values from strings or booleans.
export const parseBoolean = (value: string | boolean | undefined): boolean => {
	if (typeof value === 'boolean') {
		return value
	}
	if (typeof value === 'string') {
		return value.toLowerCase() === 'true'
	}

	throw new Error(`Invalid boolean value: ${value}`)
}
