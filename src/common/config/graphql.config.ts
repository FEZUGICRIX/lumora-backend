import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default'
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo'
import { GraphQLFormattedError } from 'graphql'
import GraphQLUpload from 'graphql-upload/GraphQLUpload.mjs'
import { join } from 'path'

export const graphqlConfig: ApolloDriverConfig = {
	driver: ApolloDriver,
	autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
	context: ({ req, res }) => ({ req, res }),
	playground: false,
	plugins: [ApolloServerPluginLandingPageLocalDefault()],
	resolvers: { Upload: GraphQLUpload },
	introspection: true,
	formatError: (err: GraphQLFormattedError) => {
		const originalError = (err.extensions as any)?.exception

		const graphQLFormattedError: any = {
			message: err.message,
			code: err.extensions?.code || 'INTERNAL_SERVER_ERROR',
		}

		if (originalError?.response) {
			const resp = originalError.response
			graphQLFormattedError.message = Array.isArray(resp.message)
				? resp.message.join(', ')
				: resp.message
			graphQLFormattedError.code =
				originalError.status || graphQLFormattedError.code

			if (resp.errors) {
				graphQLFormattedError.errors = resp.errors
			}
		}

		return graphQLFormattedError
	},
}
