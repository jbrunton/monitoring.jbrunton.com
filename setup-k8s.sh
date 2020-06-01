#!/bin/bash
set -e

if [ "$1" == "dev" ]; then
  export SECRETS_DIR=./k8s/dev/secrets
elif [ "$1" == "prod" ]; then 
  if [ -z $SECRETS_DIR ]; then
    echo "SECRETS_DIR not specified."
    exit 1
  fi
  cp -R $SECRETS_DIR ./k8s/prod/secrets
elif [ "$1" == "clean" ]; then
  rm -rf ./k8s/prod/secrets
  rm ./k8s/base/alertmanager/config.yml
  exit 0
else
  echo "Missing or invalid environment."
  echo "Valid usage:"
  echo "  ./setup-k8s.sh dev"
  echo "  SECRETS_DIR=/path/to/secrets/repo ./setup-k8s.sh prod"
  echo "  ./setup-k8s.sh clean"
  exit 1
fi

export SECRETS_FILE=$SECRETS_DIR/secrets.env
export $(grep -v '^#' $SECRETS_FILE | xargs -0)
envsubst < ./k8s/base/alertmanager/config.template.yml > ./k8s/base/alertmanager/config.yml
