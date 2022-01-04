package graph

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.

import (
	"context"
	"fmt"

	"github.com/gilaniasher/reddit-clone/backend/go-graphql/graph/generated"
	"github.com/gilaniasher/reddit-clone/backend/go-graphql/graph/model"
)

func (r *mutationResolver) CreatePost(ctx context.Context, input model.NewPost) (*model.Post, error) {
	panic(fmt.Errorf("not implemented"))
}

func (r *queryResolver) Posts(ctx context.Context) ([]*model.Post, error) {
	var posts []*model.Post

	user := model.User{
		Username: "u/jerryJoe",
		Email:    "test@email.com",
	}

	dummyPost := model.Post{
		Likes:      300,
		Subreddit:  "r/AskReddit",
		Poster:     &user,
		Timestamp:  "2022-01-03T21:45:58+00:00",
		HeaderText: "Whats your favorite song?",
		SubText:    "Mine is Never Gonna Give you Up",
	}

	posts = append(posts, &dummyPost)
	return posts, nil
}

// Mutation returns generated.MutationResolver implementation.
func (r *Resolver) Mutation() generated.MutationResolver { return &mutationResolver{r} }

// Query returns generated.QueryResolver implementation.
func (r *Resolver) Query() generated.QueryResolver { return &queryResolver{r} }

type mutationResolver struct{ *Resolver }
type queryResolver struct{ *Resolver }
