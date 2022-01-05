import { gql } from '@apollo/client'

// There are problems with this mutation, not the right syntax
// I might have to add username and email again

export const CREATE_USER = gql`
	mutation CreateUser($input: NewUser!) {
		createUser(input: $input)
	}
`
