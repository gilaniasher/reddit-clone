#!/bin/bash

cmd1="cd react-frontend && npm start"
cmd2="cd backend/go-graphql && go run server.go"
cmd3="cd backend/serverless && npm run view-table"
cmd4="cd backend/serverless && npm run start-db"

gnome-terminal \
    --tab --title="React"         -e "bash -c '$cmd1'" \
    --tab --title="Go"            -e "bash -c '$cmd2'" \
    --tab --title="View DynamoDB" -e "bash -c '$cmd3'" \
    --tab --title="DynamoDB"      -e "bash -c '$cmd4'" \
    2> /dev/null

echo "React: http://localhost:3000/"
echo "Go Server: http://localhost:8080/"
echo "DynamoDB Local: http://localhost:8000"
echo "View DynamoDB: http://localhost:8001"
