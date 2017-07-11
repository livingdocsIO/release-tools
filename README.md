# Release-tools
CLI tools for handling a release on git/github

## Purpose

TODO

## Usage
```bash
git clone
git@github.com:upfrontIO/release-tools.git
cd release-tools
```

### Create a release branch
```bash
./create-release-branch.sh \
  release-version \
  masterTag
```

### Finish release
```bash
./finish-release.sh \
  release-version
```

### Tag and publish a Docker image

#### Execution
```bash
./tag-publish-docker-image.sh \
  DOCKER_USERNAME \
  DOCKER_REPOSITORY \
  DOCKER_LOGIN_USERNAME \
  DOCKER_LOGIN_PASSWORD \
  DOCKER_LOCAL_IMAGE \
  GIT_BRANCH \
  PULL_REQUEST_NUMBER \
  COMMIT_HASH
```

#### Running the tests
```bash
./tests/tag-publish-docker-image/index.sh
```

## Copyright

Copyright (c) 2017 Livingdocs AG, all rights reserved

It is not permitted to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of this Software ('release-managers'), except when explicitly stated otherwise by Livingdocs AG.
