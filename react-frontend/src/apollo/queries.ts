import { gql } from '@apollo/client'

/* Loading Recent Posts */

export interface ShortPostData {
	likes: number,
	subreddit: string,
	poster: string,
	timestamp: string,
	headerText: string,
	subText: string
}

export interface RecentPostsResult {
	posts: ShortPostData[]
}

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
