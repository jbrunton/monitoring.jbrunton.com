#!/bin/bash
set -e

if [ "$1" != "dev" ] && [ "$1" != "prod" ]; then
  echo "Valid usage:"
  echo "  ./setup dev"
  echo "  ./setup prod"
  exit 1
fi

cp .env.$1 .env
envsubst < ./alertmanager/config.template.yml > ./alertmanager/config.yml
