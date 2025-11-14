import type { Request } from 'express'
import type { Session } from 'express-session'

export type AuthenticatedRequest = Request & {
	session: Session & {
		userId?: string
		role?: string
	}
}

export type AuthenticatedContext = {
	req: AuthenticatedRequest
}
