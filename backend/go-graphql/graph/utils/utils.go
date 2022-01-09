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
