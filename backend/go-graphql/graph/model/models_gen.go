// Code generated by github.com/99designs/gqlgen, DO NOT EDIT.

package model

type NewPost struct {
	Subreddit  string `json:"subreddit"`
	PosterID   string `json:"posterId"`
	HeaderText string `json:"headerText"`
	SubText    string `json:"subText"`
}

type NewUser struct {
	Username string `json:"username"`
	Email    string `json:"email"`
}

type Post struct {
	ID         string `json:"id"`
	Likes      int    `json:"likes"`
	Subreddit  string `json:"subreddit"`
	Poster     *User  `json:"poster"`
	Timestamp  string `json:"timestamp"`
	HeaderText string `json:"headerText"`
	SubText    string `json:"subText"`
}

type User struct {
	ID       string `json:"id"`
	Username string `json:"username"`
	Email    string `json:"email"`
}