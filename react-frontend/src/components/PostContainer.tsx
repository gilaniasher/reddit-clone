import React, { useEffect } from 'react'
import LoadingShortPosts from './LoadingShortPosts'
import ShortPost from './ShortPost'
import CreatePost from './CreatePost'

import { useQuery, useReactiveVar } from '@apollo/client'
import { localStateVar } from '../apollo/cache'
import { useLocalState } from '../apollo/hooks'

import { RECENT_POSTS } from '../apollo/queries'
import { RecentPostsInput, RecentPostsOutput } from '../apollo/apiTypes'

const PostContainer: React.FC = () => {
	const { showCreatePost, reloadPosts, loggedInUser } = useReactiveVar(localStateVar)
	const { loading, error, data, refetch } = useQuery<RecentPostsOutput, RecentPostsInput>(RECENT_POSTS, { variables: { username: loggedInUser?.username } })
	const { triggerReload } = useLocalState(localStateVar)	

	useEffect(() => {
		if (reloadPosts) {
			refetch()
			triggerReload(false)
		}
	}, [reloadPosts, refetch, triggerReload])

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
		<div className="flex flex-col w-full items-center py-5 overflow-y-scroll no-scrollbar">
			{ showCreatePost && <CreatePost /> }
			{ data.posts.length === 0 && <p>No Posts to Show</p> }
			{ data.posts.map((p, idx) => 
					<ShortPost key={idx} post={p} />
			)}
		</div>
	)
}

export default PostContainer
