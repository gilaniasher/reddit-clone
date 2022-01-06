import { InMemoryCache, makeVar } from '@apollo/client'

export interface LocalUser {
	username: string,
	email: string
}

export interface LocalState {
	modal: '' | 'login' | 'signup',
	loggedInUser?: LocalUser,
	showCreatePost: boolean
}

export const localStateVar = makeVar<LocalState>({
	modal: '',
	showCreatePost: false
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
