import { CommentData } from '../apollo/queries'

export const postsData = [
	{
		id: '0',
		likes: 2401,
		dislikes: 0,
		userLiked: false,
		userDisliked: false,
		subreddit: 'r/AskReddit',
		poster: 'u/testUser',
		timestamp: '2022-01-03T21:45:58+00:00',
		headerText: 'Whats your favorite song?',
		subText: 'Mine is Never Gonna Give you Up',
	},
	{
		id: '1',
		likes: 5431,
		dislikes: 0,
		userLiked: false,
		userDisliked: false,
		subreddit: 'r/AITA',
		poster: 'u/Joey',
		timestamp: '2021-12-27T21:45:58+00:00',
		headerText: 'Whats your favorite animal?',
		subText: 'I love dogs',
	}
]

export const comments: CommentData[] = [
	{
		id: '2',
		content: 'this is so lame',
		poster: 'jack',
		timestamp: '2022-01-07T22:13:24+00:00',
		likes: 0,
		dislikes: 0,
		userLiked: false,
		userDisliked: false,
		replies: []
	},
	{
		id: '0',
		content: 'wow this is so cool',
		poster: 'joe',
		timestamp: '2022-01-07T22:13:24+00:00',
		likes: 0,
		dislikes: 0,
		userLiked: false,
		userDisliked: false,
		replies: [
			{
				id: '1',
				content: 'wow this is so cool',
				poster: 'joe',
				timestamp: '2022-01-07T22:13:24+00:00',
				likes: 0,
				dislikes: 0,
				userLiked: false,
				userDisliked: false,
				replies: [{
					id: '3',
					content: 'woahhh',
					poster: 'james',
					timestamp: '2022-01-07T22:13:24+00:00',
					likes: 0,
					dislikes: 0,
					userLiked: false,
					userDisliked: false,
					replies: []
				}]
			},
			{
				id: '4',
				content: 'blahh',
				poster: 'jil',
				timestamp: '2022-01-07T22:13:24+00:00',
				likes: 0,
				dislikes: 0,
				userLiked: false,
				userDisliked: false,
				replies: []
			}
		]
	}
]
