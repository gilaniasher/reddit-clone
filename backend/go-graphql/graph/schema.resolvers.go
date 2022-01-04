package graph

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.

// go get -u github.com/99designs/cmd
// go run github.com/99designs/gqlgen generate

import (
	"context"
	"fmt"
	"log"
	"time"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/dynamodb"
	"github.com/aws/aws-sdk-go/service/dynamodb/dynamodbattribute"
	"github.com/aws/aws-sdk-go/service/dynamodb/expression"

	"github.com/gilaniasher/reddit-clone/backend/go-graphql/graph/generated"
	"github.com/gilaniasher/reddit-clone/backend/go-graphql/graph/model"
	"github.com/google/uuid"
)

var sess = session.Must(session.NewSessionWithOptions(session.Options{SharedConfigState: session.SharedConfigEnable}))
var svc = dynamodb.New(sess, &aws.Config{Endpoint: aws.String("http://localhost:8000")})

type UserDdb struct {
	UserId   string
	Username string
	Email    string
}

type PostDdb struct {
	PostId            string
	CreationTimestamp string
	PosterId          string
	Likes             int
	Subreddit         string
	HeaderText        string
	SubText           string
}

func (r *mutationResolver) CreatePost(ctx context.Context, input model.NewPost) (bool, error) {
	// Add this post to DynamoDB
	newPostId := uuid.New().String()

	av, _ := dynamodbattribute.MarshalMap(PostDdb{
		PostId:            newPostId,
		CreationTimestamp: time.Now().Format(time.RFC3339),
		PosterId:          input.PosterID,
		Likes:             0,
		Subreddit:         input.Subreddit,
		HeaderText:        input.HeaderText,
		SubText:           input.SubText,
	})

	_, err := svc.PutItem(&dynamodb.PutItemInput{Item: av, TableName: aws.String("postsTable-reddit-clone")})

	if err != nil {
		log.Fatalf("Error calling PutItem: %s", err)
	}

	fmt.Printf("Successfully added post with PostID: %s to PostsTable\n", newPostId)
	return true, nil
}

func (r *mutationResolver) CreateUser(ctx context.Context, input model.NewUser) (bool, error) {
	// Add user to DynamoDB
	newUserId := uuid.New().String()

	av, _ := dynamodbattribute.MarshalMap(UserDdb{
		UserId:   newUserId,
		Username: input.Username,
		Email:    input.Email,
	})

	_, err := svc.PutItem(&dynamodb.PutItemInput{Item: av, TableName: aws.String("usersTable-reddit-clone")})

	if err != nil {
		log.Fatalf("Error calling PutItem: %s", err)
	}

	fmt.Printf("Successfully added user with UserID: %s", newUserId)
	return true, nil
}

func (r *queryResolver) Posts(ctx context.Context) ([]*model.Post, error) {
	expr, _ := expression.NewBuilder().Build()

	result, err := svc.Scan(&dynamodb.ScanInput{
		ExpressionAttributeNames:  expr.Names(),
		ExpressionAttributeValues: expr.Values(),
		TableName:                 aws.String("postsTable-reddit-clone"),
		Limit:                     aws.Int64(10),
	})

	if err != nil {
		log.Fatalf("Failed to make Scan DDB Call: %s", err)
	}

	var posts []*model.Post

	for _, i := range result.Items {
		post := PostDdb{}
		err = dynamodbattribute.UnmarshalMap(i, &post)

		if err != nil {
			log.Fatalf("Error unmarshalling: %s", err)
		}

		// Query Dynamodb for user from userId
		userResult, err := svc.GetItem(&dynamodb.GetItemInput{
			TableName: aws.String("usersTable-reddit-clone"),
			Key:       map[string]*dynamodb.AttributeValue{"UserId": {S: aws.String(post.PosterId)}},
		})

		if err != nil {
			log.Fatalf("Error looking up user with id: %s", post.PosterId)
		}

		ddbUser := UserDdb{}
		dynamodbattribute.UnmarshalMap(userResult.Item, &ddbUser)

		posts = append(posts, &model.Post{
			Likes:      post.Likes,
			Subreddit:  post.Subreddit,
			Timestamp:  post.CreationTimestamp,
			HeaderText: post.HeaderText,
			SubText:    post.SubText,
			Poster: &model.User{
				Username: ddbUser.Username,
				Email:    ddbUser.Email,
			},
		})
	}

	return posts, nil
}

// Mutation returns generated.MutationResolver implementation.
func (r *Resolver) Mutation() generated.MutationResolver { return &mutationResolver{r} }

// Query returns generated.QueryResolver implementation.
func (r *Resolver) Query() generated.QueryResolver { return &queryResolver{r} }

type mutationResolver struct{ *Resolver }
type queryResolver struct{ *Resolver }
