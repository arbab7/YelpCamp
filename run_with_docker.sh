#!/bin/bash

. ./.env
export PORT

[ ! -z PORT ] && echo Port: $PORT

cd deployment && docker-compose up --build -d

echo Deleting dangling images
docker image prune -f