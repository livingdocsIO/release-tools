#!/bin/bash
yellowLog () { echo -e "\033[0;93m$*\033[0;0m"; }
greenLog () { echo -e "\033[0;32m$*\033[0;0m"; }
redLog () { echo -e "\033[0;31m$*\033[0;0m"; }
isLastCommandSuccessful () { [[ $1 == 0 ]]; }
assertTest () {
  if isLastCommandSuccessful $1; then
    greenLog "  Success"
  else
    redLog "  Fail"
  fi
}

yellowLog "Testing for --help argument"
./bin/tag-publish-docker-image \
  --help 2>&1 \
  | diff - tests/tag-publish-docker-image/outputs/help
assertTest $?

yellowLog "Test tagging for a feature branch"
docker_username=dev@li.io \
docker_password=1234567 \
remote_image_name=livingdocs/service-server \
local_image_name_and_tag=server:test \
pull_request_number=myfeat \
branch_name=master \
commit_sha=fea0a2f \
commit_tag='' \
./bin/tag-publish-docker-image --test 2>&1 \
  | diff - tests/tag-publish-docker-image/outputs/feature-branch
assertTest $?

yellowLog "Test tagging for a master branch"
docker_username=dev@li.io \
docker_password=1234567 \
remote_image_name=livingdocs/service-server \
local_image_name_and_tag=server:test \
pull_request_number='' \
branch_name=master \
commit_sha=ma0a2fd \
commit_tag='' \
./bin/tag-publish-docker-image --test 2>&1 \
  | diff - tests/tag-publish-docker-image/outputs/master-branch
assertTest $?

yellowLog "Test tagging for a release branch"
docker_username=dev@li.io \
docker_password=1234567 \
remote_image_name=livingdocs/service-server \
local_image_name_and_tag=server:test \
pull_request_number='' \
branch_name=release-7 \
commit_sha=rea0a2f \
commit_tag='' \
./bin/tag-publish-docker-image --test 2>&1 \
  | diff - tests/tag-publish-docker-image/outputs/release-branch
assertTest $?

yellowLog "Test tagging for a tag"
docker_username=dev@li.io \
docker_password=1234567 \
remote_image_name=livingdocs/service-server \
local_image_name_and_tag=server:test \
pull_request_number='' \
branch_name='' \
commit_sha=rea0a2f \
commit_tag=v4.2.0 \
./bin/tag-publish-docker-image --test 2>&1 \
  | diff - tests/tag-publish-docker-image/outputs/tag
assertTest $?

yellowLog "Test tagging for a release branch with an open pull request"
docker_username=dev@li.io \
docker_password=1234567 \
remote_image_name=livingdocs/service-server \
local_image_name_and_tag=server:test \
pull_request_number=myfeat \
branch_name=release-7 \
commit_sha=rea0a2f \
commit_tag='' \
./bin/tag-publish-docker-image --test 2>&1 \
  | diff - tests/tag-publish-docker-image/outputs/no-image-to-tag
assertTest $?

yellowLog "Test tagging for a random branch"
docker_username=dev@li.io \
docker_password=1234567 \
remote_image_name=livingdocs/service-server \
local_image_name_and_tag=server:test \
pull_request_number='' \
branch_name=random-7 \
commit_sha=rea0a2f \
commit_tag='' \
./bin/tag-publish-docker-image --test 2>&1 \
  | diff - tests/tag-publish-docker-image/outputs/no-image-to-tag
assertTest $?

yellowLog "Test tagging for a random branch with an open pull request"
docker_username=dev@li.io \
docker_password=1234567 \
remote_image_name=livingdocs/service-server \
local_image_name_and_tag=server:test \
pull_request_number=myfeat \
branch_name=random-7 \
commit_sha=rea0a2f \
commit_tag='' \
./bin/tag-publish-docker-image --test 2>&1 \
  | diff - tests/tag-publish-docker-image/outputs/no-image-to-tag
assertTest $?
