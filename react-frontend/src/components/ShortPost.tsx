import React, { useEffect, useState } from 'react'
import { ArrowSmUpIcon, ArrowSmDownIcon } from '@heroicons/react/outline'
import { formatLikes, formatTime } from '../utils/utils'

import { useMutation, useReactiveVar } from '@apollo/client'
import { localStateVar } from '../apollo/cache'
import { useLocalState } from '../apollo/hooks'

import { VOTE_POST } from '../apollo/mutations'
import { VotePostInput, VotePostOutput, ShortPostData } from '../apollo/apiTypes'

interface Props {
	post: ShortPostData
}

const Post: React.FC<Props> = ({ post }) => {
	const { loggedInUser } = useReactiveVar(localStateVar)
	const { setActivePost } = useLocalState(localStateVar)
	const [votePost, { data, error }] = useMutation<VotePostOutput, VotePostInput>(VOTE_POST)

	const { id, subreddit, poster, timestamp, headerText, subText } = post
	const [likes, setLikes] = useState(post.likes - post.dislikes)
	const [userLiked, setUserLiked] = useState(post.userLiked)
	const [userDisliked, setUserDisliked] = useState(post.userDisliked)

	useEffect(() => {
		if (error) {
			alert('There was an error voting on this post')
		} else if (data) {
			setLikes(data.votePost.likes - data.votePost.dislikes)
			setUserLiked(data.votePost.userLiked)
			setUserDisliked(data.votePost.userDisliked)
		}
	}, [data, error])

	const handleVotePost = (e: React.MouseEvent, like: boolean) => {
		e.stopPropagation() // Allows you to click vote buttons instead of opening long post

		if (loggedInUser === undefined)
			alert('Must be logged in to vote on posts')
		else
			votePost({ variables: { postId: post.id, username: loggedInUser.username, like } })
	}

	return (
		<div onClick={() => setActivePost(id)} className="flex w-3/5 h-36 rounded-lg border-2 border-white my-3 hover:bg-gray-700">
			<div className="w-1/12 flex flex-col justify-center items-center border-r-2 border-white">
				<ArrowSmUpIcon onClick={e => handleVotePost(e, true)} className={`relative h-10 w-10 hover:stroke-green-500 ${userLiked ? 'stroke-green-500' : ''}`} />
				{ formatLikes(likes) }
				<ArrowSmDownIcon onClick={e => handleVotePost(e, false)} className={`relative h-10 w-10 hover:stroke-red-500 ${userDisliked ? 'stroke-red-500' : ''}`} />
			</div>
			<div className="w-11/12 flex flex-col p-3">
				<div className="flex flex-row mb-2">
					<span className="font-bold mr-1">r/{ subreddit }</span>
					<span className="font-thin text-gray-500 mr-1">• Posted by { poster }</span>
					<span className="font-thin text-gray-500">• { formatTime(timestamp) }</span>
				</div>	
				<div className="text-3xl mb-2">{ headerText }</div>
				<div className="text-sm pb-2">{ subText }</div>
			</div>
		</div>
	)
}

export default Post
