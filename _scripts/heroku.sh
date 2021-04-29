#!/bin/sh -e

usage() {
  echo "OVERVIEW: Build apps according to BUILD_ENV value. Meant to be used for Heroku deployment"
  exit
}

if [ "$1" = '-h' ] || [ "$1" = '--help' ]; then
  usage
fi

(
  PROJECT_ROOT="$(cd $(dirname $0)/..; pwd)"

  cd $PROJECT_ROOT

  if [ "$BUILD_ENV" = "123done" ]; then
    yarn workspace 123done start
    pm2 logs all
  elif [ "$BUILD_ENV" = "321done" ]; then
    yarn workspace 123done start
    pm2 logs all
  else
    echo "Error: no build config for BUILD_ENV value '$BUILD_ENV'"
    exit 1
  fi
)