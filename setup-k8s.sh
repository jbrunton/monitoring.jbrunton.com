#!/bin/bash
set -e

if [ -z $SECRETS_FILE ]; then
  if [ "$1" == "dev" ]; then
    export SECRETS_FILE=./k8s/dev/secrets/monitoring.env
  else
    echo "SECRETS_FILE not specified."
    echo "Valid usage:"
    echo "  ./setup dev"
    echo "  SECRETS_FILE=/path/to/secrets.env ./setup"
    exit 1
  fi
fi

export $(grep -v '^#' $SECRETS_FILE | xargs -0)
envsubst < ./alertmanager/config.template.yml > ./alertmanager/config.yml
