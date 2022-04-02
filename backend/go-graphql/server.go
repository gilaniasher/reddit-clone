package main

import (
	"context"
	"log"
	"net/http"
	"os"
	"strings"

	"github.com/99designs/gqlgen/graphql/handler"
	"github.com/gilaniasher/reddit-clone/backend/go-graphql/graph"
	"github.com/gilaniasher/reddit-clone/backend/go-graphql/graph/generated"

	"github.com/aws/aws-lambda-go/lambda"
	"github.com/awslabs/aws-lambda-go-api-proxy/core"
	"github.com/awslabs/aws-lambda-go-api-proxy/gorillamux"
	"github.com/gorilla/mux"

	"github.com/rs/cors"
)

var muxRouter *mux.Router

func init() {
	muxRouter = mux.NewRouter()
	server := handler.NewDefaultServer(generated.NewExecutableSchema(generated.Config{Resolvers: &graph.Resolver{}}))

	// Add CORS middleware around every request
	muxRouter.Use(cors.New(cors.Options{
		AllowedOrigins:   []string{"https://gilaniasher.github.io"},
		AllowCredentials: true,
	}).Handler)

	muxRouter.Handle("/query", server)
}

func lambdaHandler(ctx context.Context, req core.SwitchableAPIGatewayRequest) (*core.SwitchableAPIGatewayResponse, error) {
	muxAdapter := gorillamux.New(muxRouter)
	rsp, err := muxAdapter.Proxy(req)

	if err != nil {
		log.Println(err)
	}

	return rsp, err
}

func raspberryHandler() {
	port := "8080"
	certPath := "/etc/letsencrypt/live/stuffdwarf.ddns.net/fullchain.pem"
	keyPath := "/etc/letsencrypt/live/stuffdwarf.ddns.net/privkey.pem"

	// Add SSL Certificate for HTTPS (generated with certbot)
	log.Fatal(http.ListenAndServeTLS(":"+port, certPath, keyPath, muxRouter))
}

func main() {
	isRunningAtLambda := strings.Contains(os.Getenv("AWS_EXECUTION_ENV"), "AWS_Lambda_")

	if isRunningAtLambda {
		lambda.Start(lambdaHandler)
	} else {
		raspberryHandler()
	}
}
