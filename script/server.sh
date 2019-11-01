#!/bin/sh

cd $( dirname "$0" )/..

port=${1:-49160}

# Stop the container, don't wait to kill it
docker stop --time 0 login-with-github > /dev/null 2>&1

# Remove the container
docker rm login-with-github > /dev/null > /dev/null 2>&1

echo "Running. To stop:\ndocker stop --time 0 login-with-github"

# Run the container
container=$( docker run --name login-with-github \
  -p $port:8000 \
  --detach \
  --env-file ./.env \
  login-with-github )

docker logs --follow $container
