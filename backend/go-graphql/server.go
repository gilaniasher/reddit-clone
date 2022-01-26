package main

import (
	"log"
	"net/http"

	"github.com/99designs/gqlgen/graphql/handler"
	"github.com/99designs/gqlgen/graphql/playground"
	"github.com/gilaniasher/reddit-clone/backend/go-graphql/graph"
	"github.com/gilaniasher/reddit-clone/backend/go-graphql/graph/generated"

	"github.com/go-chi/chi/v5"
	"github.com/rs/cors"
)

func main() {
	port := "8080"
	certPath := "/etc/letsencrypt/live/stuffdwarf.ddns.net/fullchain.pem"
	keyPath := "/etc/letsencrypt/live/stuffdwarf.ddns.net/privkey.pem"
	router := chi.NewRouter()

	// Add CORS middleware around every request
	router.Use(cors.New(cors.Options{
		AllowedOrigins:   []string{"https://gilaniasher.github.io"},
		AllowCredentials: true,
	}).Handler)

	srv := handler.NewDefaultServer(generated.NewExecutableSchema(generated.Config{Resolvers: &graph.Resolver{}}))

	router.Handle("/", playground.Handler("GraphQL playground", "/query"))
	router.Handle("/query", srv)

	log.Printf("connect to https://localhost:%s/ for GraphQL playground", port)

	// Add SSL Certificate for HTTPS (generated with certbot)
	log.Fatal(http.ListenAndServeTLS(":"+port, certPath, keyPath, router))
}
