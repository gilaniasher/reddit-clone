import { InMemoryCache, makeVar } from '@apollo/client'
import { CognitoUser } from 'amazon-cognito-identity-js'

export interface LocalUser {
	username: string,
	email: string,
	cognitoUser: CognitoUser
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
