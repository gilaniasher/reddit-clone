package utils

import (
	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/dynamodb"
)

var sess = session.Must(session.NewSessionWithOptions(session.Options{SharedConfigState: session.SharedConfigEnable}))
var SVC = dynamodb.New(sess, &aws.Config{Endpoint: aws.String("http://localhost:8000")})

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
