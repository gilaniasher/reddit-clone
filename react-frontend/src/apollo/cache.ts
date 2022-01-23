import { InMemoryCache, makeVar } from '@apollo/client'

export interface LocalUser {
	username: string,
	email: string
}

export interface LocalState {
	modal: '' | 'login' | 'signup' | 'verify',
	loggedInUser?: LocalUser,
	showCreatePost: boolean,
	reloadPosts: boolean,
	activePostId?: string,
	activeCommentId?: string
}

export const localStateVar = makeVar<LocalState>({
	modal: '',
	showCreatePost: false,
	reloadPosts: false
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
