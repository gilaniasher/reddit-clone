import React from 'react'
import { ArrowSmUpIcon, ArrowSmDownIcon } from '@heroicons/react/outline'
import { ShortPostData } from '../apollo/queries'

import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
dayjs.extend(relativeTime)

interface Props {
	post: ShortPostData
}

const Post: React.FC<Props> = ({ post }) => {
	const { likes, subreddit, poster, timestamp, headerText, subText } = post
	const formatLikes = (num: number) => Math.abs(num) > 999 ? Math.sign(num) * Math.round(Math.abs(num) / 100) / 10 + 'k' : Math.sign(num) * Math.abs(num)

	return (
		<div className="flex w-3/5 h-3/5 rounded-lg border-2 border-white my-3">
			<div className="w-1/12 flex flex-col justify-center items-center border-r-2 border-white">
				<ArrowSmUpIcon className="h-10 w-10 hover:stroke-green-500" />
				{ formatLikes(likes) }
				<ArrowSmDownIcon className="h-10 w-10 hover:stroke-red-500" />
			</div>
			<div className="w-11/12 flex flex-col p-3">
				<div className="flex flex-row mb-2">
					<span className="font-bold mr-1">r/{ subreddit }</span>
					<span className="font-thin text-gray-500 mr-1">• Posted by { poster }</span>
					<span className="font-thin text-gray-500">• { dayjs(timestamp).fromNow() }</span>
				</div>	
				<div className="text-3xl mb-2">{ headerText }</div>
				<div className="text-sm">{ subText }</div>
			</div>
		</div>
	)
}

export default Post
