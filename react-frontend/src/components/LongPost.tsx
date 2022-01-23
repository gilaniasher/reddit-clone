import React, { useEffect, useState } from 'react'
import ShortPost from './ShortPost'
import Comment from './Comment'

import { useMutation, useQuery, useReactiveVar } from '@apollo/client'
import { useLocalState } from '../apollo/hooks'
import { localStateVar } from '../apollo/cache'

import { GET_COMMENTS, GET_POST } from '../apollo/queries'
import { CREATE_COMMENT } from '../apollo/mutations'
import { CommentInput, CommentOutput, PostInput, PostOutput, CreateCommentInput, CreateCommentOutput } from '../apollo/apiTypes'

interface Props {
	postId: string
}

const LongPost: React.FC<Props> = ({ postId }) => {
	const { loggedInUser } = useReactiveVar(localStateVar)
	const { setActivePost } = useLocalState(localStateVar)

	const { loading: postLoading, data: postData, error: postError } = useQuery<PostOutput, PostInput>(GET_POST, { variables: { postId, username: loggedInUser?.username } })
	const { loading: commentsLoading, data: commentsData, error: commentsError, refetch: refetchComments } = useQuery<CommentOutput, CommentInput>(GET_COMMENTS, { variables: { postId, username: loggedInUser?.username } })
	const [createComment, { called: newCommentCalled, loading: newCommentLoading, error: newCommentError }] = useMutation<CreateCommentOutput, CreateCommentInput>(CREATE_COMMENT)

	const [content, setContent] = useState('')

	const submitPost = () => {
		if (loggedInUser === undefined) {
			alert('Cannot create post without being logged in')
			return
		}

		createComment({ variables: { postId, posterId: loggedInUser.username, content } })
		setContent('')
	}

	useEffect(() => {
		if (newCommentCalled && !newCommentLoading &&  !newCommentError)
			refetchComments()
	}, [newCommentCalled, newCommentLoading, newCommentError, refetchComments])

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
					value={content}
					onChange={e => setContent(e.target.value)}
				/>
				<button onClick={submitPost} className="flex flex-row justify-center items-center rounded-lg w-32 h-8 mx-4 bg-cyan-300 text-black mb-4">
					{ newCommentLoading && <div className="animate-spin h-5 w-5 rounded-full border-b-2 border-gray-900 mr-3" /> }
					Comment
				</button>
			</div>
			<div className="w-3/5 h-full p-4 rounded-md border-2 border-white">
				<h1 className="text-2xl mb-4">Comments</h1>
				{ commentsData.comments.map(c => <Comment key={c.id} data={c} refreshComments={refetchComments} />) }
			</div>
		</div>
	</>
}

export default LongPost
