package graph

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.

// go get -u github.com/99designs/gqlgen/cmd
// go run github.com/99designs/gqlgen generate

import (
	"context"
	"errors"
	"fmt"
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
	Username string
	Email    string
}

type PostDdb struct {
	PostId            string
	CreationTimestamp string
	Poster            string
	Likes             int
	Subreddit         string
	HeaderText        string
	SubText           string
}

func (r *mutationResolver) CreatePost(ctx context.Context, input model.NewPost) (string, error) {
	// Add this post to DynamoDB
	newPostId := uuid.New().String()

	av, _ := dynamodbattribute.MarshalMap(PostDdb{
		PostId:            newPostId,
		CreationTimestamp: time.Now().Format(time.RFC3339),
		Poster:            input.Poster,
		Likes:             0,
		Subreddit:         input.Subreddit,
		HeaderText:        input.HeaderText,
		SubText:           input.SubText,
	})

	_, err := svc.PutItem(&dynamodb.PutItemInput{Item: av, TableName: aws.String("postsTable-reddit-clone")})

	if err != nil {
		return newPostId, errors.New("database put call failed")
	}

	fmt.Printf("Successfully added post with PostID: %s to PostsTable\n", newPostId)
	return newPostId, nil
}

func (r *mutationResolver) CreateUser(ctx context.Context, input model.NewUser) (string, error) {
	// Verify that username is unique in DynamoDB
	result, errGet := svc.GetItem(&dynamodb.GetItemInput{
		TableName: aws.String("usersTable-reddit-clone"),
		Key: map[string]*dynamodb.AttributeValue{
			"Username": {S: aws.String(input.Username)},
		},
	})

	if errGet != nil {
		return input.Username, errors.New("database get call failed")
	}

	if result.Item != nil {
		return input.Username, errors.New("this username has been taken")
	}

	// Add user to DynamoDB
	av, _ := dynamodbattribute.MarshalMap(UserDdb{
		Username: input.Username,
		Email:    input.Email,
	})

	_, errPut := svc.PutItem(&dynamodb.PutItemInput{Item: av, TableName: aws.String("usersTable-reddit-clone")})

	if errPut != nil {
		fmt.Printf("Error calling PutItem: %s\n", errPut)
		return input.Username, errors.New("database put call failed")
	}

	fmt.Printf("Successfully added user: %s\n", input.Username)
	return input.Username, nil
}

func (r *queryResolver) Posts(ctx context.Context) ([]*model.Post, error) {
	var posts []*model.Post
	expr, _ := expression.NewBuilder().Build()

	result, err := svc.Scan(&dynamodb.ScanInput{
		ExpressionAttributeNames:  expr.Names(),
		ExpressionAttributeValues: expr.Values(),
		TableName:                 aws.String("postsTable-reddit-clone"),
		Limit:                     aws.Int64(10),
	})

	if err != nil {
		return posts, errors.New("database scan call failed")
	}

	for _, i := range result.Items {
		post := PostDdb{}
		dynamodbattribute.UnmarshalMap(i, &post)

		posts = append(posts, &model.Post{
			Likes:      post.Likes,
			Subreddit:  post.Subreddit,
			Timestamp:  post.CreationTimestamp,
			HeaderText: post.HeaderText,
			SubText:    post.SubText,
			Poster:     post.Poster,
		})
	}

	fmt.Println("Hot Posts Retrieved")
	return posts, nil
}

func (r *queryResolver) User(ctx context.Context, username string) (*model.User, error) {
	result, err := svc.GetItem(&dynamodb.GetItemInput{
		TableName: aws.String("usersTable-reddit-clone"),
		Key: map[string]*dynamodb.AttributeValue{
			"Username": {S: aws.String(username)},
		},
	})

	userDdb := UserDdb{}
	user := model.User{}

	if err != nil {
		return &user, errors.New("database get call failed")
	} else if result.Item == nil {
		return &user, errors.New("user, " + username + ", does not exist")
	}

	dynamodbattribute.UnmarshalMap(result.Item, &userDdb)
	user.Username = userDdb.Username
	user.Email = userDdb.Email

	return &user, nil
}

// Mutation returns generated.MutationResolver implementation.
func (r *Resolver) Mutation() generated.MutationResolver { return &mutationResolver{r} }

// Query returns generated.QueryResolver implementation.
func (r *Resolver) Query() generated.QueryResolver { return &queryResolver{r} }

type mutationResolver struct{ *Resolver }
type queryResolver struct{ *Resolver }
