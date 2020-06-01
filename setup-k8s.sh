#!/bin/bash
set -e

if [ "$1" != "dev" ] && [ "$1" != "prod" ]; then
  echo "Valid usage:"
  echo "  ./setup dev"
  echo "  ./setup prod"
  exit 1
fi

if [ "$1" == "dev" ]; then
  export ALERTMANAGER_SLACK_API_URL=${ALERTMANAGER_SLACK_API_URL:-http://example.com/dummy-hook}
  export ALERTMANAGER_OPSGENIE_API_KEY=${ALERTMANAGER_OPSGENIE_API_KEY:-DUMMY-KEY}
fi

envsubst < ./alertmanager/config.template.yml > ./alertmanager/config.yml
