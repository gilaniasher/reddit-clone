import { InMemoryCache, makeVar } from '@apollo/client'

export interface LocalState {
	modal: '' | 'login' | 'signup'
}

export const localStateVar = makeVar<LocalState>({
	modal: ''
})

export const cache = new InMemoryCache({
	typePolicies: {
		Query: {
			fields: {
				localState: {
					read() { return localStateVar() }
				}
			}
		}
	}
})
