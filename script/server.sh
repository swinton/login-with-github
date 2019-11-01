#!/bin/sh

cd $( dirname "$0" )/..

# Stop the container, don't wait to kill it
docker stop --time 0 login-with-github

# Remove the container
docker rm login-with-github

# Run the container
docker run --name login-with-github \
  --interactive \
  --detach \
  --env-file ./.env \
  login-with-github

echo "🚀 Running. To stop:\ndocker stop --time 0 login-with-github"
