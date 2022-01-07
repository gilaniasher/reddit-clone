import { gql } from '@apollo/client'

/* Create New User (Simplified) */

export interface CreateUserInput {
	input: {
		username: string,
		email: string
	}
}

export interface CreateUserResult {
	username: string
}

export const CREATE_USER = gql`
	mutation createUser($input: NewUser!) {
		createUser(input: $input)
	}
`

/* Create New Post */

export interface CreatePostInput {
	input: {
		subreddit: string,
		poster: string,
		headerText: string,
		subText: string
	}
}

export interface CreatePostResult {
	postId: string
}

export const CREATE_POST = gql`
	mutation createPost($input: NewPost!)	{
		createPost(input: $input)
	}
`

/* Upvote/Downvote a Post */

export interface VotePostInput {
	postId: string,
	username: string,
	like: boolean
}

export interface VotePostResult {
	postId: string
}

export const VOTE_POST = gql`
	mutation votePost($postId: String!, $username: String!, $like: Boolean!) {
		votePost(postId: $postId, username: $username, like: $like)
	}
`
