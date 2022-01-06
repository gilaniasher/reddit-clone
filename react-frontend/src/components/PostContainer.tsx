import React, { useEffect } from 'react'
import LoadingShortPosts from './LoadingShortPosts'
import ShortPost from './ShortPost'
import CreatePost from './CreatePost'

import { useQuery, useReactiveVar } from '@apollo/client'
import { RECENT_POSTS, RecentPostsInput, RecentPostsResult } from '../apollo/queries'
import { localStateVar } from '../apollo/cache'
import { useLocalState } from '../apollo/hooks'

const PostContainer: React.FC = () => {
	const { showCreatePost, reloadPosts, loggedInUser } = useReactiveVar(localStateVar)
	const { loading, error, data, refetch } = useQuery<RecentPostsResult, RecentPostsInput>(RECENT_POSTS, { variables: { username: loggedInUser?.username } })
	const { triggerReload } = useLocalState(localStateVar)	

	useEffect(() => {
		if (reloadPosts) {
			refetch()
			triggerReload(false)
		}
	}, [reloadPosts])

	if (loading)
		return (
			<div className="flex flex-col w-full items-center py-5">
				<LoadingShortPosts />
			</div>
		)
	else if (error || !data) {
		return <p>GraphQL Error</p>
	}

	return (
		<div className="flex flex-col w-full items-center py-5 overflow-y-scroll">
			{ showCreatePost && <CreatePost /> }
			{ data.posts.length === 0 && <p>No Posts to Show</p> }
			{ data.posts.map((p, idx) => 
					<ShortPost key={idx} post={p} />
			)}
		</div>
	)
}

export default PostContainer
