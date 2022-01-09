package utils

type UserDdb struct {
	Username string
	Email    string
}

type PostDdb struct {
	PostId            string
	CreationTimestamp string
	Poster            string
	Likes             []*string `dynamodbav:",stringset"` // Will default to a list (not set) without this
	Dislikes          []*string `dynamodbav:",stringset"`
	Subreddit         string
	HeaderText        string
	SubText           string
	Replies           []*string `dynamodbav:",omitempty"` // Top level comment ids. This tag prevents it from being null but rather undefined
}

type CommentDdb struct {
	CommentId         string
	Content           string
	Poster            string
	CreationTimestamp string
	ParentId          *string   // If this comment is a reply, it will have a parent comment id
	Likes             []*string `dynamodbav:",stringset"`
	Dislikes          []*string `dynamodbav:",stringset"`
	Replies           []*string // Comment ids of replies
}
