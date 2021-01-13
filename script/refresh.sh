#!/bin/sh

# Refresh an access token
# See: https://docs.github.com/developers/apps/refreshing-user-to-server-access-tokens#renewing-a-user-token-with-a-refresh-token

payload=$(
  jq --null-input \
    --arg client_id "$CLIENT_ID" \
    --arg client_secret "$CLIENT_SECRET" \
    --arg refresh_token "$REFRESH_TOKEN" \
    '{"client_id": $client_id, "client_secret": $client_secret, "refresh_token": $refresh_token, "grant_type": "refresh_token"}'
)

curl --include --request POST \
  --url https://github.com/login/oauth/access_token \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data "$payload"
