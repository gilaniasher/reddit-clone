import { gql } from '@apollo/client'

export const CREATE_USER = gql`
	mutation createUser($username: String!, $email: String!) {
		createUser(username: $username, email: $email)
	}
`

export const CREATE_POST = gql`
	mutation createPost($subreddit: String!, $poster: String!, $headerText: String!, $subText: String!)	{
		createPost(subreddit: $subreddit, poster: $poster, headerText: $headerText, subText: $subText)
	}
`

export const VOTE_POST = gql`
	mutation votePost($postId: String!, $username: String!, $like: Boolean!) {
		votePost(postId: $postId, username: $username, like: $like) {
			likes
			dislikes
			userLiked
			userDisliked
		}
	}
`

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
