import React from 'react'
import LoadingShortPosts from './LoadingShortPosts'
import ShortPost from './ShortPost'

import { useQuery } from '@apollo/client'
import { RECENT_POSTS, RecentPostsResult } from '../apollo/queries'

const PostContainer: React.FC = () => {
	const { loading, error, data } = useQuery<RecentPostsResult>(RECENT_POSTS)

	if (loading)
		return (
			<div className="flex flex-col w-full items-center py-5">
				<LoadingShortPosts />
			</div>
		)
	else if (error || !data) {
		console.log(error)
		return <p>GraphQL Error</p>
	}

	return (
		<div className="flex flex-col w-full items-center py-5">
			{ data.posts.length === 0 && <p>No Posts to Show</p> }
			{ data.posts.map((p, idx) => 
					<ShortPost key={idx} post={p} />
			)}
		</div>
	)
}

export default PostContainer
