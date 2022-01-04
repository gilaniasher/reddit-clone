import { gql } from '@apollo/client'

export const RECENT_POSTS = gql`
	query {
		posts {
			likes
			subreddit
			poster {
				id
				username
				email
			}
			timestamp
			headerText
			subText
		}
	}  
`
