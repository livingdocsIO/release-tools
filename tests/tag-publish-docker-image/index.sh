#!/bin/bash

set -e

echo "Testing for --help argument."
./tag-publish-docker-image.sh \
  --help \
  | diff - tests/tag-publish-docker-image/outputs/help


echo "Testing for missing arguments."
./tag-publish-docker-image.sh \
  arg1 \
  arg2 \
  arg3 \
  arg4 \
  | diff - tests/tag-publish-docker-image/outputs/help


echo "Testing for missing Docker credentials as env vars."
./tag-publish-docker-image.sh \
  livingdocs/service-server \
  server:test \
  master \
  42 \
  fea0a2f \
  true \
  | diff - tests/tag-publish-docker-image/outputs/help

echo "Testing for missing DOCKER_USERNAME."
DOCKER_PASSWORD=1234567 \
./tag-publish-docker-image.sh \
  li/service-server \
  server:test \
  master \
  42 \
  fea0a2f \
  true \
  | diff - tests/tag-publish-docker-image/outputs/help

echo "Testing for missing DOCKER_PASSWORD."
DOCKER_USERNAME=dev@li.io \
./tag-publish-docker-image.sh \
  li/service-server \
  server:test \
  master \
  42 \
  fea0a2f \
  true \
  | diff - tests/tag-publish-docker-image/outputs/help


echo "Testing for a feature branch (PR #42) from the master branch."
DOCKER_USERNAME=dev@li.io \
DOCKER_PASSWORD=1234567 \
./tag-publish-docker-image.sh \
  li/service-server \
  server:test \
  master \
  42 \
  fea0a2f \
  true \
  | diff - tests/tag-publish-docker-image/outputs/feature-branch

echo "Testing for merging on the master branch."
DOCKER_USERNAME=dev@li.io \
DOCKER_PASSWORD=1234567 \
./tag-publish-docker-image.sh \
  li/service-server \
  server:test \
  master \
  false \
  ma0a2fd \
  true \
  | diff - tests/tag-publish-docker-image/outputs/merge-master-branch

echo "Testing for merging on the release branch."
DOCKER_USERNAME=dev@li.io \
DOCKER_PASSWORD=1234567 \
./tag-publish-docker-image.sh \
  li/service-server \
  server:test \
  release-7 \
  false \
  rea0a2f \
  true \
  | diff - tests/tag-publish-docker-image/outputs/merge-release-branch

echo "Testing for a PR #42 from the release branch."
DOCKER_USERNAME=dev@li.io \
DOCKER_PASSWORD=1234567 \
./tag-publish-docker-image.sh \
  li/service-server \
  server:test \
  release-7 \
  42 \
  rea0a2f \
  true \
  | diff - tests/tag-publish-docker-image/outputs/no-image-to-tag

echo "Testing for merging on a random branch."
DOCKER_USERNAME=dev@li.io \
DOCKER_PASSWORD=1234567 \
./tag-publish-docker-image.sh \
  li/service-server \
  server:test \
  random-7 \
  false \
  rea0a2f \
  true \
  | diff - tests/tag-publish-docker-image/outputs/no-image-to-tag

echo "Testing for a PR #42 from a random branch."
DOCKER_USERNAME=dev@li.io \
DOCKER_PASSWORD=1234567 \
./tag-publish-docker-image.sh \
  li/service-server \
  server:test \
  random-7 \
  42 \
  rea0a2f \
  true \
  | diff - tests/tag-publish-docker-image/outputs/no-image-to-tag
