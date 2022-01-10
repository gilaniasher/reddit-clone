export interface ShortPostData {
	id: string,
	likes: number,
	dislikes: number,
	userLiked: boolean,
	userDisliked: boolean,
	subreddit: string,
	poster: string,
	timestamp: string,
	headerText: string,
	subText: string
}

export interface CommentData {
	id: string,
	parentId?: string,
	content: string,
	poster: string,
	timestamp: string,
	likes: number,
	dislikes: number,
	userLiked: boolean,
	userDisliked: boolean,
	replies: CommentData[]
}

/* Queries */

export interface RecentPostsInput {
	username?: string
}

export interface RecentPostsOutput {
	posts: ShortPostData[]
}

export interface UserInput {
	username: string
}

export interface UserOutput {
	user: {
		username: string,
		email: string
	}
}

export interface PostInput {
	postId: string,
	username?: string
}

export interface PostOutput {
	post: {
		id: string,
		likes: number,
		dislikes: number,
		userLiked: boolean,
		userDisliked: boolean,
		subreddit: string,
		poster: string,
		timestamp: string,
		headerText: string,
		subText: string
	}
}

export interface CommentInput {
	postId: string,
	username?: string
}

export interface CommentOutput {
	comments: CommentData[]
}

/* Mutations */

export interface CreateUserInput {
	username: string,
	email: string
}

export interface CreateUserOutput {
	username: string
}

export interface CreatePostInput {
	subreddit: string,
	poster: string,
	headerText: string,
	subText: string
}

export interface CreatePostOutput {
	postId: string
}

export interface VotePostInput {
	postId: string,
	username: string,
	like: boolean
}

export interface VotePostOutput {
	postId: string
}

export interface CreateCommentInput {
	postId: string,
	posterId: string,
	parentId?: string,
	content: string
}

export interface CreateCommentOutput {
	createComment: {
		id: string,
		parentId?: string,
		content: string,
		poster: string,
		timestamp: string,
		likes: number,
		dislikes: number,
		userLiked: boolean,
		userDisliked: boolean,
	}	
}
