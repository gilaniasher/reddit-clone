import React, { useEffect, useState } from 'react'
import { ArrowSmUpIcon, ArrowSmDownIcon, ChatAltIcon } from '@heroicons/react/outline'
import { formatTime, formatLikes } from '../utils/utils'

import { useMutation, useReactiveVar } from '@apollo/client'
import { localStateVar } from '../apollo/cache'

import { VOTE_COMMENT } from '../apollo/mutations'
import { CommentData, VoteCommentInput, VoteCommentOutput } from '../apollo/apiTypes'

interface Props {
	data: CommentData
}

const Comment: React.FC<Props> = ({ data }) => {
	const { content, poster, replies, timestamp } = data
	const [likes, setLikes] = useState(data.likes - data.dislikes)
	const [userLiked, setUserLiked] = useState(data.userLiked)
	const [userDisliked, setUserDisliked] = useState(data.userDisliked)

	const { loggedInUser } = useReactiveVar(localStateVar)
	const [voteComment, { data: likeData, error }] = useMutation<VoteCommentOutput, VoteCommentInput>(VOTE_COMMENT)

	useEffect(() => {
		if (error) {
			alert('There was an error voting on this comment')
		} else if (likeData) {
			setLikes(likeData.voteComment.likes - likeData.voteComment.dislikes)
			setUserLiked(likeData.voteComment.userLiked)
			setUserDisliked(likeData.voteComment.userDisliked)
		}
	}, [likeData, error])

	const handleVoteComment = (like: boolean) => {
		if (loggedInUser === undefined)
			alert('Must be logged in to vote on comments')
		else
			voteComment({ variables: { commentId: data.id, username: loggedInUser.username, like } })
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
					<div className="flex flex-row rounded px-1 hover:bg-gray-300 ml-4">
						<ChatAltIcon className="w-7 h-7 mr-2 stroke-gray-500" />
						<span className="text-gray-500">Reply</span>
					</div>
				</div>
			</div>
			<div className="pl-8 mt-8">
				{ replies.map(c => <Comment data={c} />)}
			</div>
		</div>
	)
}

export default Comment
