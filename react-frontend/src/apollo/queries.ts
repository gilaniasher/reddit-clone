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
