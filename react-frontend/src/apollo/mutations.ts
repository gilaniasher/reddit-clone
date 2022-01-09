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
	mutation createUser($username: String!, $email: String!) {
		createUser(username: $username, email: $email)
	}
`

/* Create New Post */

export interface CreatePostInput {
	subreddit: string,
	poster: string,
	headerText: string,
	subText: string
}

export interface CreatePostResult {
	postId: string
}

export const CREATE_POST = gql`
	mutation createPost($subreddit: String!, $poster: String!, $headerText: String!, $subText: String!)	{
		createPost(subreddit: $subreddit, poster: $poster, headerText: $headerText, subText: $subText)
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

/* Create Comment */

export interface CreateCommentInput {
	postId: string,
	posterId: string,
	parentId?: string,
	content: string
}

export interface CreateCommentOutput {
	createComment: {
		id: string,
		parentId?: string,
		content: string,
		poster: string,
		timestamp: string,
		likes: number,
		dislikes: number,
		userLiked: boolean,
		userDisliked: boolean,
	}	
}

export const CREATE_COMMENT = gql`
	mutation createComment($postId: String!, $posterId: String!, $parentId: String, $content: String!) {
		createComment(postId: $postId, posterId: $posterId, parentId: $parentId, content: $content) {
			id
			parentId
			content
			poster
			timestamp
			likes
			dislikes
			userLiked
			userDisliked
		}
	}
`