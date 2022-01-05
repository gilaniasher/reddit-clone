import { gql } from '@apollo/client'

export const RECENT_POSTS = gql`
	query {
		posts {
			likes
			subreddit
			poster
			timestamp
			headerText
			subText
		}
	}  
`
