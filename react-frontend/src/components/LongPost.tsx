import React from 'react'
import ShortPost from './ShortPost'
import Comment from './Comment'

import { useMutation, useQuery, useReactiveVar } from '@apollo/client'
import { useLocalState } from '../apollo/hooks'
import { localStateVar } from '../apollo/cache'
import { CommentInput, CommentResult, GET_COMMENTS, GET_POST, PostInput, PostResult } from '../apollo/queries'

interface Props {
	postId: string
}

const LongPost: React.FC<Props> = ({ postId }) => {
	const { loggedInUser } = useReactiveVar(localStateVar)
	const { setActivePost } = useLocalState(localStateVar)

	const { loading: postLoading, data: postData, error: postError } = useQuery<PostResult, PostInput>(GET_POST, { variables: { postId, username: loggedInUser?.username } })
	const { loading: commentsLoading, data: commentsData, error: commentsError } = useQuery<CommentResult, CommentInput>(GET_COMMENTS, { variables: { postId, username: loggedInUser?.username } })

	if (postLoading || commentsLoading)
		return <div className="animate-spin h-5 w-5 rounded-full border-b-2 border-gray-900" />
	else if (postError || !postData)
		return <p>Post Graphql Error</p>
	else if (commentsError || !commentsData)
		return <p>Comment Graphql Error: {JSON.stringify(commentsError)}</p>

	return <>
		<button onClick={() => setActivePost()} className="rounded-lg w-32 h-10 bg-cyan-300 text-black flex items-center justify-center mt-4 ml-5">
			Go Back
		</button>
		<div className="flex flex-col w-full h-full items-center py-5 overflow-y-scroll">
			<ShortPost post={postData.post} />
			<div className="w-3/5 mb-3 border-2 border-white -my-5 rounded-b-md">
				<textarea
					className="w-full mb-4 bg-gray-800 p-4"
					placeholder="What are your thoughts?"
				/>
				<button className="rounded-lg w-24 h-6 mx-4 bg-cyan-300 text-black mb-4">Comment</button>
			</div>
			<div className="w-3/5 h-full p-4 rounded-md border-2 border-white">
				<h1 className="text-2xl mb-4">Comments</h1>
				{ commentsData.comments.map(c => <Comment data={c} />) }
			</div>
		</div>
	</>
}

export default LongPost
