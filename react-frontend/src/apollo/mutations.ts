import { gql } from '@apollo/client'

/* Create New User (Simplified) */

export interface CreateUserInput {
	username: string,
	email: string
}

export interface CreateUserResult {
	username: string
}

export const CREATE_USER = gql`
	mutation createUser($input: NewUser!) {
		createUser(input: $input)
	}
`
