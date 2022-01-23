import React, { useEffect, useState } from 'react'
import { ArrowSmUpIcon, ArrowSmDownIcon, ChatAltIcon } from '@heroicons/react/outline'
import { formatTime, formatLikes } from '../utils/utils'

import { useMutation, useReactiveVar } from '@apollo/client'
import { localStateVar } from '../apollo/cache'
import { useLocalState } from '../apollo/hooks'

import { CREATE_COMMENT, VOTE_COMMENT } from '../apollo/mutations'
import { CommentData, CreateCommentInput, CreateCommentOutput, VoteCommentInput, VoteCommentOutput } from '../apollo/apiTypes'

interface Props {
	data: CommentData,
	refreshComments: () => void
}

const Comment: React.FC<Props> = ({ data, refreshComments }) => {
	const { content, poster, replies, timestamp } = data
	const [replyContent, setReplyContent] = useState('')
	const [likes, setLikes] = useState(data.likes - data.dislikes)
	const [userLiked, setUserLiked] = useState(data.userLiked)
	const [userDisliked, setUserDisliked] = useState(data.userDisliked)

	const { loggedInUser, activeCommentId, activePostId } = useReactiveVar(localStateVar)
	const { setActiveComment } = useLocalState(localStateVar)

	const [voteComment, { data: likeData, error: likeError }] = useMutation<VoteCommentOutput, VoteCommentInput>(VOTE_COMMENT)
	const [createReply, { called: replyCalled, error: replyError, loading: replyLoading }] = useMutation<CreateCommentOutput, CreateCommentInput>(CREATE_COMMENT)

	useEffect(() => {
		if (likeError) {
			alert('There was an error voting on this comment')
		} else if (likeData) {
			setLikes(likeData.voteComment.likes - likeData.voteComment.dislikes)
			setUserLiked(likeData.voteComment.userLiked)
			setUserDisliked(likeData.voteComment.userDisliked)
		}
	}, [likeData, likeError])

	useEffect(() => {
		if (replyError)
			alert('Error replying to this comment')
		else if (replyCalled && !replyLoading) {
			console.log('about to refresh comments')
			refreshComments()
		}
	}, [replyCalled, replyError, replyLoading, refreshComments])

	const handleVoteComment = (like: boolean) => {
		if (loggedInUser === undefined)
			alert('Must be logged in to vote on comments')
		else
			voteComment({ variables: { commentId: data.id, username: loggedInUser.username, like } })
	}

	const handleReply = () => {
		if (loggedInUser === undefined)
			alert('Must be logged in to comment')
		else if (activePostId === undefined)
			alert('No post to comment on!')
		else {
			createReply({ variables: { postId: activePostId, posterId: loggedInUser.username, parentId: data.id, content: replyContent } })
			setReplyContent('')
			setActiveComment(undefined)
		}
	}

	return (
		<div className="h-max mb-6">
			<div className="h-20">
				<div className="flex flex-row mb-2">
					<div className="w-5 h-5 rounded-full bg-white mr-4" />
					<span className="font-bold mr-1">{poster}</span>
					<span className="font-thin text-gray-500 mr-1">•</span>
					<span className="font-thin text-gray-500">{formatTime(timestamp)}</span>
				</div>
				<span className="font-thin pl-10">{ content }</span>
				<div className="flex flex-row pl-10 mt-2">
					<ArrowSmUpIcon onClick={() => handleVoteComment(true)} className={`w-7 h-7 mr-1 hover:stroke-green-500 ${userLiked ? 'stroke-green-500' : 'stroke-gray-500'}`} />
					<span className="pt-0.5 mr-1">{formatLikes(likes)}</span>
					<ArrowSmDownIcon onClick={() => handleVoteComment(false)} className={`w-7 h-7 hover:stroke-red-500 ${userDisliked ? 'stroke-red-500' : 'stroke-gray-500'}`} />
					<div onClick={() => setActiveComment(data.id)} className="flex flex-row rounded px-1 hover:bg-gray-300 ml-4">
						<ChatAltIcon className="w-7 h-7 mr-2 stroke-gray-500" />
						<span className="text-gray-500">Reply</span>
					</div>
				</div>
			</div>
			{ (activeCommentId === data.id) &&
					<div className="ml-10 p-2 mt-5 border-2 border-white -my-5 rounded-md">
						<textarea
							className="w-full mb-4 bg-gray-800 p-4"
							placeholder="What are your thoughts?"
							value={replyContent}
							onChange={e => setReplyContent(e.target.value)}
						/>
						<div className="flex flex-row">
							<button onClick={handleReply} className="flex flex-row justify-center items-center rounded-lg w-24 h-8 mx-4 bg-cyan-300 text-black mb-4">
								{ replyLoading && <div className="animate-spin h-5 w-5 rounded-full border-b-2 border-gray-900 mr-3" /> }
								Reply
							</button>
							<button onClick={() => setActiveComment(undefined)} className="rounded-lg w-24 h-8 bg-red-500 text-black">
								Cancel
							</button>
						</div>
					</div>
			}
			<div className="pl-8 mt-8">
				{ (replies || []).map(c => <Comment key={c.id} data={c} refreshComments={refreshComments} />)}
			</div>
		</div>
	)
}

export default Comment
