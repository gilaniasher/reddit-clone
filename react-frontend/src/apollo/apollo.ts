import { ApolloClient } from '@apollo/client'
import { cache } from './cache'

export const client = new ApolloClient({
	uri: 'https://stuffdwarf.ddns.net:8080/query', // Raspberry Pi Go server
	cache
})
