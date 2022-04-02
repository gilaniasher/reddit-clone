import { ApolloClient } from '@apollo/client'
import { cache } from './cache'

export const client = new ApolloClient({
	// uri: 'https://stuffdwarf.ddns.net:8080/query', // Raspberry Pi Go server
	uri: 'https://o9t4jbgtre.execute-api.us-east-1.amazonaws.com/dev/query', // Lambda Server
	cache
})
