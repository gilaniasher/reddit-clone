import { gql } from '@apollo/client'

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

export const GET_USER = gql`
	query getUser($username: String!) {
		user(username: $username) {
			username,
			email
		}
	}
`

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
