package graph

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.

// go get -u github.com/99designs/gqlgen/cmd
// go run github.com/99designs/gqlgen generate

import (
	"context"
	"errors"
	"fmt"
	"strings"
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
	Likes             []*string `dynamodbav:",stringset"` // Will default to a list (not set) without this
	Dislikes          []*string `dynamodbav:",stringset"`
	Subreddit         string
	HeaderText        string
	SubText           string
}

func contains(s []*string, target string) bool {
	for _, x := range s {
		if target == *x {
			return true
		}
	}

	return false
}

func (r *mutationResolver) CreatePost(ctx context.Context, input model.NewPost) (string, error) {
	// Add this post to DynamoDB
	newPostId := uuid.New().String()

	av, _ := dynamodbattribute.MarshalMap(PostDdb{
		PostId:            newPostId,
		CreationTimestamp: time.Now().Format(time.RFC3339),
		Poster:            input.Poster,
		Likes:             []*string{aws.String("*")}, // You can't just put an empty set so place an asterisk
		Dislikes:          []*string{aws.String("*")},
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
	if strings.ContainsAny(input.Username, "*") {
		return input.Username, errors.New("usernames cannot have asterisks")
	}

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

func (r *mutationResolver) VotePost(ctx context.Context, postID string, username string, like bool) (string, error) {
	var likeVerb, dislikeVerb string

	if like {
		likeVerb = "ADD"
		dislikeVerb = "DELETE"
	} else {
		likeVerb = "DELETE"
		dislikeVerb = "ADD"
	}

	_, err := svc.UpdateItem(&dynamodb.UpdateItemInput{
		TableName: aws.String("postsTable-reddit-clone"),
		Key: map[string]*dynamodb.AttributeValue{
			"PostId": {S: aws.String(postID)},
		},
		ExpressionAttributeValues: map[string]*dynamodb.AttributeValue{
			":voters": {SS: []*string{aws.String(username)}}, // SS for String Set
		},
		UpdateExpression: aws.String(fmt.Sprintf("%s Likes :voters %s Dislikes :voters", likeVerb, dislikeVerb)),
	})

	if err != nil {
		fmt.Printf("Error calling UpdateItem: %s\n", err)
		return postID, errors.New("database update call failed")
	}

	fmt.Printf("Post %s has been voted on by %s\n", postID, username)
	return postID, nil
}

func (r *queryResolver) Posts(ctx context.Context, username *string) ([]*model.Post, error) {
	var posts []*model.Post
	expr, _ := expression.NewBuilder().Build()

	result, err := svc.Scan(&dynamodb.ScanInput{
		TableName:                 aws.String("postsTable-reddit-clone"),
		IndexName:                 aws.String("timestamp"),
		ExpressionAttributeNames:  expr.Names(),
		ExpressionAttributeValues: expr.Values(),
		Limit:                     aws.Int64(10),
	})

	if err != nil {
		return posts, errors.New("database scan call failed")
	}

	for _, i := range result.Items {
		post := PostDdb{}
		dynamodbattribute.UnmarshalMap(i, &post)

		var userLiked, userDisliked bool

		if username == nil {
			userLiked = false
			userDisliked = false
		} else {
			// Should figure out how to query the set from DDB instead of this manual search
			userLiked = contains(post.Likes, *username)
			userDisliked = contains(post.Dislikes, *username)
		}

		posts = append(posts, &model.Post{
			ID:           post.PostId,
			Likes:        len(post.Likes) - 1,
			Dislikes:     len(post.Dislikes) - 1,
			UserLiked:    userLiked,
			UserDisliked: userDisliked,
			Subreddit:    post.Subreddit,
			Timestamp:    post.CreationTimestamp,
			HeaderText:   post.HeaderText,
			SubText:      post.SubText,
			Poster:       post.Poster,
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
