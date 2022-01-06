import { InMemoryCache, makeVar } from '@apollo/client'

export interface LocalUser {
	username: string,
	email: string
}

export interface LocalState {
	modal: '' | 'login' | 'signup',
	loggedInUser?: LocalUser
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
