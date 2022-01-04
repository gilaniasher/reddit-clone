import React from 'react'
import ShortPost from './ShortPost'

const postsData = [
	{
		likes: 2401,
		subreddit: 'r/AskReddit',
		poster: 'u/testUser',
		timestamp: '2022-01-03T21:45:58+00:00',
		headerText: 'Whats your favorite song?',
		subText: 'Mine is Never Gonna Give you Up',
	},
	{
		likes: 5431,
		subreddit: 'r/AITA',
		poster: 'u/Joey',
		timestamp: '2021-12-27T21:45:58+00:00',
		headerText: 'Whats your favorite animal?',
		subText: 'I love dogs',
	}
]

const PostContainer: React.FC = () => {
	return (
		<div className="flex flex-col w-full items-center py-5">
			{ postsData.map((p, idx) => 
					<ShortPost key={idx} post={p} />
			)}
		</div>
	)
}

export default PostContainer
