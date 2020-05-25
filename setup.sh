#!/bin/bash
set -e

envsubst < ./alertmanager/config.template.yml > ./alertmanager/config.yml
