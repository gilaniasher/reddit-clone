package graph

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.

import (
	"context"
	"errors"
	"fmt"
	"strings"
	"time"

	"github.com/google/uuid"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/service/dynamodb"
	"github.com/aws/aws-sdk-go/service/dynamodb/dynamodbattribute"
	"github.com/aws/aws-sdk-go/service/dynamodb/expression"

	"github.com/gilaniasher/reddit-clone/backend/go-graphql/graph/generated"
	"github.com/gilaniasher/reddit-clone/backend/go-graphql/graph/model"
	"github.com/gilaniasher/reddit-clone/backend/go-graphql/graph/utils"
)

func (r *mutationResolver) CreatePost(ctx context.Context, input model.NewPost) (string, error) {
	// Add this post to DynamoDB
	newPostId := uuid.New().String()

	av, _ := dynamodbattribute.MarshalMap(utils.PostDdb{
		PostId:            newPostId,
		CreationTimestamp: time.Now().Format(time.RFC3339),
		Poster:            input.Poster,
		Likes:             []*string{aws.String("*")}, // You can't just put an empty set so place an asterisk
		Dislikes:          []*string{aws.String("*")},
		Subreddit:         input.Subreddit,
		HeaderText:        input.HeaderText,
		SubText:           input.SubText,
	})

	_, err := utils.SVC.PutItem(&dynamodb.PutItemInput{Item: av, TableName: aws.String("postsTable-reddit-clone")})

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
	result, errGet := utils.SVC.GetItem(&dynamodb.GetItemInput{
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
	av, _ := dynamodbattribute.MarshalMap(utils.UserDdb{
		Username: input.Username,
		Email:    input.Email,
	})

	_, errPut := utils.SVC.PutItem(&dynamodb.PutItemInput{Item: av, TableName: aws.String("usersTable-reddit-clone")})

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

	_, err := utils.SVC.UpdateItem(&dynamodb.UpdateItemInput{
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

func (r *mutationResolver) CreateComment(ctx context.Context, postID string, posterID string, parentID *string, content string) (*model.Comment, error) {
	newId := uuid.New().String()
	curTimestamp := time.Now().Format(time.RFC3339)

	// Update Posts table if this is a top level comment (no parentID)
	if parentID == nil {
		av := &dynamodb.AttributeValue{S: aws.String(newId)}

		_, err := utils.SVC.UpdateItem(&dynamodb.UpdateItemInput{
			TableName: aws.String("postsTable-reddit-clone"),
			Key: map[string]*dynamodb.AttributeValue{
				"PostId": {S: aws.String(postID)},
			},
			ExpressionAttributeValues: map[string]*dynamodb.AttributeValue{
				":comment":    {L: []*dynamodb.AttributeValue{av}},
				":empty_list": {L: []*dynamodb.AttributeValue{}},
			},
			UpdateExpression: aws.String("SET Replies = list_append(if_not_exists(Replies, :empty_list), :comment)"),
		})

		if err != nil {
			fmt.Printf("Error calling UpdateItem: %s\n", err)
			return nil, errors.New("database update call failed")
		}
	}

	// Add to Comments Table (TODO this operation should be atomic with the last)
	av, _ := dynamodbattribute.MarshalMap(utils.CommentDdb{
		CommentId:         newId,
		Content:           content,
		Poster:            posterID,
		CreationTimestamp: curTimestamp,
		ParentId:          parentID,
		Likes:             []*string{aws.String("*")},
		Dislikes:          []*string{aws.String("*")},
		Replies:           []*string{},
	})

	_, err := utils.SVC.PutItem(&dynamodb.PutItemInput{Item: av, TableName: aws.String("commentsTable-reddit-clone")})

	if err != nil {
		fmt.Printf("Error calling PutItem: %s\n", err)
		return nil, errors.New("database put call failed")
	}

	comment := model.Comment{
		ID:           newId,
		Content:      content,
		Poster:       posterID,
		Timestamp:    curTimestamp,
		ParentID:     parentID,
		Likes:        0,
		Dislikes:     0,
		UserLiked:    false,
		UserDisliked: false,
		Replies:      []*model.Comment{},
	}

	fmt.Printf("Succesfully created comment %s for post %s\n", newId, postID)
	return &comment, nil
}

func (r *queryResolver) Posts(ctx context.Context, username *string) ([]*model.Post, error) {
	var posts []*model.Post
	expr, _ := expression.NewBuilder().Build()

	result, err := utils.SVC.Scan(&dynamodb.ScanInput{
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
		post := utils.PostDdb{}
		dynamodbattribute.UnmarshalMap(i, &post)

		var userLiked, userDisliked bool

		if username != nil {
			// Should figure out how to query the set from DDB instead of this manual search
			userLiked = utils.Contains(post.Likes, *username)
			userDisliked = utils.Contains(post.Dislikes, *username)
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

func (r *queryResolver) Post(ctx context.Context, postID string, username *string) (*model.Post, error) {
	result, err := utils.SVC.GetItem(&dynamodb.GetItemInput{
		TableName: aws.String("postsTable-reddit-clone"),
		Key: map[string]*dynamodb.AttributeValue{
			"PostId": {S: aws.String(postID)},
		},
	})

	postDdb := utils.PostDdb{}
	post := model.Post{}
	var userLiked, userDisliked bool

	if err != nil {
		return &post, errors.New("database get call failed")
	} else if result.Item == nil {
		return &post, errors.New("post, " + postID + ", does not exist")
	}

	dynamodbattribute.UnmarshalMap(result.Item, &postDdb)

	if username != nil {
		// Should figure out how to query the set from DDB instead of this manual search
		userLiked = utils.Contains(postDdb.Likes, *username)
		userDisliked = utils.Contains(postDdb.Dislikes, *username)
	}

	post = model.Post{
		ID:           postDdb.PostId,
		Likes:        len(postDdb.Likes) - 1,
		Dislikes:     len(postDdb.Dislikes) - 1,
		UserLiked:    userLiked,
		UserDisliked: userDisliked,
		Subreddit:    postDdb.Subreddit,
		Poster:       postDdb.Poster,
		Timestamp:    postDdb.CreationTimestamp,
		HeaderText:   postDdb.HeaderText,
		SubText:      postDdb.SubText,
	}

	return &post, nil
}

func (r *queryResolver) User(ctx context.Context, username string) (*model.User, error) {
	result, err := utils.SVC.GetItem(&dynamodb.GetItemInput{
		TableName: aws.String("usersTable-reddit-clone"),
		Key: map[string]*dynamodb.AttributeValue{
			"Username": {S: aws.String(username)},
		},
	})

	userDdb := utils.UserDdb{}
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

func (r *queryResolver) Comments(ctx context.Context, postID string, username *string) ([]*model.Comment, error) {
	// Retrieve post to get top level comment IDs
	result, err := utils.SVC.GetItem(&dynamodb.GetItemInput{
		TableName: aws.String("postsTable-reddit-clone"),
		Key: map[string]*dynamodb.AttributeValue{
			"PostId": {S: aws.String(postID)},
		},
		ProjectionExpression: aws.String("Replies"),
	})

	if err != nil {
		return nil, errors.New("database get call failed")
	} else if result.Item == nil {
		return nil, errors.New("post, " + postID + ", does not exist")
	}

	postDdb := utils.PostDdb{}
	dynamodbattribute.UnmarshalMap(result.Item, &postDdb)

	if len(postDdb.Replies) == 0 {
		fmt.Printf("Succesfully retrieved 0 comments for post %s\n", postID)
		return nil, nil
	}

	// Batch Get these top level comments
	commentKeys := []map[string]*dynamodb.AttributeValue{}

	for _, commentId := range postDdb.Replies {
		commentKeys = append(commentKeys, map[string]*dynamodb.AttributeValue{
			"CommentId": {S: commentId},
		})
	}

	batchResult, err := utils.SVC.BatchGetItem(&dynamodb.BatchGetItemInput{
		RequestItems: map[string]*dynamodb.KeysAndAttributes{
			"commentsTable-reddit-clone": {Keys: commentKeys},
		},
	})

	if err != nil {
		fmt.Printf("Batch get failed for post %s\n", postID)
		return nil, errors.New("database batch get items call failed")
	}

	commentsDdb := []*utils.CommentDdb{}
	dynamodbattribute.UnmarshalListOfMaps(batchResult.Responses["commentsTable-reddit-clone"], &commentsDdb)
	comments := []*model.Comment{}

	for _, commentDdb := range commentsDdb {
		var userLiked, userDisliked bool

		if username != nil {
			userLiked = utils.Contains(commentDdb.Likes, *username)
			userDisliked = utils.Contains(commentDdb.Dislikes, *username)
		}

		comments = append(comments, &model.Comment{
			ID:           commentDdb.CommentId,
			ParentID:     nil,
			Content:      commentDdb.Content,
			Poster:       commentDdb.Poster,
			Timestamp:    commentDdb.CreationTimestamp,
			Likes:        len(commentDdb.Likes) - 1,
			Dislikes:     len(commentDdb.Dislikes) - 1,
			UserLiked:    userLiked,
			UserDisliked: userDisliked,
			Replies:      []*model.Comment{}, // TODO need to add support for getting replies
		})
	}

	fmt.Printf("Succesfully retrieved %d comments for post %s\n", len(comments), postID)
	return comments, nil
}

func (r *queryResolver) Comment(ctx context.Context, commentID string, username *string) (*model.Comment, error) {
	result, err := utils.SVC.GetItem(&dynamodb.GetItemInput{
		TableName: aws.String("commentsTable-reddit-clone"),
		Key: map[string]*dynamodb.AttributeValue{
			"CommentId": {S: aws.String(commentID)},
		},
	})

	if err != nil {
		return nil, errors.New("database get call failed")
	} else if result.Item == nil {
		return nil, errors.New("comment, " + commentID + ", does not exist")
	}

	commentDdb := utils.CommentDdb{}
	dynamodbattribute.UnmarshalMap(result.Item, &commentDdb)
	var userLiked, userDisliked bool

	if username != nil {
		userLiked = utils.Contains(commentDdb.Likes, *username)
		userDisliked = utils.Contains(commentDdb.Dislikes, *username)
	}

	comment := model.Comment{
		ID:           commentDdb.CommentId,
		ParentID:     commentDdb.ParentId,
		Content:      commentDdb.Content,
		Poster:       commentDdb.Poster,
		Timestamp:    commentDdb.CreationTimestamp,
		Likes:        len(commentDdb.Likes) - 1,
		Dislikes:     len(commentDdb.Dislikes) - 1,
		UserLiked:    userLiked,
		UserDisliked: userDisliked,
		Replies:      []*model.Comment{}, // TODO implement replies
	}

	return &comment, nil
}

// Mutation returns generated.MutationResolver implementation.
func (r *Resolver) Mutation() generated.MutationResolver { return &mutationResolver{r} }

// Query returns generated.QueryResolver implementation.
func (r *Resolver) Query() generated.QueryResolver { return &queryResolver{r} }

type mutationResolver struct{ *Resolver }
type queryResolver struct{ *Resolver }
