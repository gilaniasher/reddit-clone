import React from 'react'
import ShortPost from './ShortPost'
import Comment from './Comment'

import { postsData, comments } from '../mocks/data'

interface Props {
	postId: string
}

export interface CommentData {
	commentId: string,
	content: string,
	poster: string,
	timestamp: string,
	likes: number,
	dislikes: number,
	userLiked: boolean,
	userDisliked: boolean,
	replies: CommentData[]
}

const LongPost: React.FC<Props> = ({ postId }) => {
	return (
		<div className="flex flex-col w-full h-full items-center py-5 overflow-y-scroll">
			<ShortPost post={postsData[0]} />
			<div className="w-3/5 mb-3 border-2 border-white -my-5 rounded-b-md">
				<textarea
					className="w-full mb-4 bg-gray-800 p-4"
					placeholder="What are your thoughts?"
				/>
				<button className="rounded-lg w-24 h-6 mx-4 bg-cyan-300 text-black mb-4">Comment</button>
			</div>
			<div className="w-3/5 h-full p-4 rounded-md border-2 border-white">
				<h1 className="text-2xl mb-4">Comments</h1>
				{ comments.map(c => <Comment data={c} />) }
			</div>
		</div>
	)
}

export default LongPost
