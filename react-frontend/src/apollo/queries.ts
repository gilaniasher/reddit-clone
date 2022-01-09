import { gql } from '@apollo/client'

/* Loading Recent Posts */

export interface ShortPostData {
	id: string,
	likes: number,
	dislikes: number,
	userLiked: boolean,
	userDisliked: boolean,
	subreddit: string,
	poster: string,
	timestamp: string,
	headerText: string,
	subText: string
}

export interface RecentPostsInput {
	username?: string
}

export interface RecentPostsResult {
	posts: ShortPostData[]
}

export const RECENT_POSTS = gql`
	query posts($username: String) {
		posts(username: $username) {
			id
			likes
			dislikes
			userLiked
			userDisliked
			subreddit
			poster
			timestamp
			headerText
			subText
		}
	}  
`

/* Load User Data */

export interface UserInput {
	username: string
}

export interface UserResponse {
	user: {
		username: string,
		email: string
	}
}

export const GET_USER = gql`
	query getUser($username: String!) {
		user(username: $username) {
			username,
			email
		}
	}
`

/* Load Post */

export interface PostInput {
	postId: string,
	username?: string
}

export interface PostResult {
	post: {
		id: string,
		likes: number,
		dislikes: number,
		userLiked: boolean,
		userDisliked: boolean,
		subreddit: string,
		poster: string,
		timestamp: string,
		headerText: string,
		subText: string
	}
}

export const GET_POST = gql`
	query getPost($postId: String!, $username: String) {
		post(postId: $postId, username: $username) {
			id
			likes
			dislikes
			userLiked
			userDisliked
			subreddit
			poster
			timestamp
			headerText
			subText
		}
	}
`

/* Load Comments */

export interface CommentData {
	id: string,
	parentId?: string,
	content: string,
	poster: string,
	timestamp: string,
	likes: number,
	dislikes: number,
	userLiked: boolean,
	userDisliked: boolean,
	replies: CommentData[]
}

export interface CommentInput {
	postId: string,
	username?: string
}

export interface CommentResult {
	comments: CommentData[]
}

export const GET_COMMENTS = gql`
	query getComments($postId: String!, $username: String) {
		comments(postId: $postId, username: $username) {
			id
			parentId
			content
			poster
			timestamp
			likes
			dislikes
			userLiked
			userDisliked
			replies {
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
	}
`
