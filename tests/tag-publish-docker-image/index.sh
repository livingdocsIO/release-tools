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
  | diff - tests/tag-publish-docker-image/outputs/help

echo "Testing for feature branch."
./tag-publish-docker-image.sh \
  livingdocs \
  service-server \
  dev@li.io \
  1234567 \
  server:test \
  master \
  42 \
  fea0a2f \
  true \
  | diff - tests/tag-publish-docker-image/outputs/feature-branch

echo "Testing for merging on the master branch."
./tag-publish-docker-image.sh \
  livingdocs \
  service-server \
  dev@li.io \
  1234567 \
  server:test \
  master \
  false \
  ma0a2fd \
  true \
  | diff - tests/tag-publish-docker-image/outputs/merge-master-branch

echo "Testing for merging on the release branch."
./tag-publish-docker-image.sh \
  livingdocs \
  service-server \
  dev@li.io \
  1234567 \
  server:test \
  release-7 \
  false \
  rea0a2f \
  true \
  | diff - tests/tag-publish-docker-image/outputs/merge-release-branch
