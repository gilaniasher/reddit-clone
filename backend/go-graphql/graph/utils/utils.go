package utils

import (
	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/dynamodb"
	"github.com/aws/aws-sdk-go/service/dynamodb/dynamodbattribute"
	"github.com/gilaniasher/reddit-clone/backend/go-graphql/graph/model"
)

var sess = session.Must(session.NewSessionWithOptions(session.Options{SharedConfigState: session.SharedConfigEnable}))

// var SVC = dynamodb.New(sess, &aws.Config{Endpoint: aws.String("http://localhost:8000")})
var SVC = dynamodb.New(sess)

func Contains(s []*string, target string) bool {
	for _, x := range s {
		if target == *x {
			return true
		}
	}

	return false
}

/**
 * Manually searched likes and dislikes for the username
 * TODO: Ideally we would just query the set from dynamodb with the username
 */
func UserLikes(likes []*string, dislikes []*string, username *string) (bool, bool) {
	if username != nil {
		return Contains(likes, *username), Contains(dislikes, *username)
	}

	return false, false
}

/**
 * Takes a slice of comment ids and formats them so they can be passed to
 * the BatchGetItem query
 */
func FormatBatchComments(commentIds []*string) []map[string]*dynamodb.AttributeValue {
	commentKeys := []map[string]*dynamodb.AttributeValue{}

	for _, commentId := range commentIds {
		commentKeys = append(commentKeys, map[string]*dynamodb.AttributeValue{
			"CommentId": {S: commentId},
		})
	}

	return commentKeys
}

/**
 * Takes a comment id and returns the comment replies
 * Only returns the next level of replies
 */
func GetReplies(commentId string, username *string) []*model.Comment {
	// Get the reply comment IDs
	result, err := SVC.GetItem(&dynamodb.GetItemInput{
		TableName: aws.String("commentsTable-reddit-clone"),
		Key: map[string]*dynamodb.AttributeValue{
			"CommentId": {S: aws.String(commentId)},
		},
		ProjectionExpression: aws.String("Replies"),
	})

	if err != nil {
		return []*model.Comment{}
	}

	commentDdb := CommentDdb{}
	dynamodbattribute.UnmarshalMap(result.Item, &commentDdb)

	if len(commentDdb.Replies) == 0 {
		return []*model.Comment{}
	}

	// Batch get reply comments
	batchResult, err := SVC.BatchGetItem(&dynamodb.BatchGetItemInput{
		RequestItems: map[string]*dynamodb.KeysAndAttributes{
			"commentsTable-reddit-clone": {Keys: FormatBatchComments(commentDdb.Replies)},
		},
	})

	if err != nil {
		return []*model.Comment{}
	}

	commentsDdb := []*CommentDdb{}
	dynamodbattribute.UnmarshalListOfMaps(batchResult.Responses["commentsTable-reddit-clone"], &commentsDdb)
	comments := []*model.Comment{}

	for _, commentDdb := range commentsDdb {
		userLiked, userDisliked := UserLikes(commentDdb.Likes, commentDdb.Dislikes, username)

		comments = append(comments, &model.Comment{
			ID:           commentDdb.CommentId,
			ParentID:     aws.String(commentId),
			Content:      commentDdb.Content,
			Poster:       commentDdb.Poster,
			Timestamp:    commentDdb.CreationTimestamp,
			Likes:        len(commentDdb.Likes) - 1,
			Dislikes:     len(commentDdb.Dislikes) - 1,
			UserLiked:    userLiked,
			UserDisliked: userDisliked,
			Replies:      []*model.Comment{}, // Getting further replies will need to be a recursive call
		})
	}

	return comments
}
