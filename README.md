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
./li-release create-release-branch \
  release-version \
  masterTag
```

### Finish release
```bash
./li-release finish-release \
  release-version
```

### Tag and publish a Docker image

#### Execution
```bash
DOCKER_USERNAME=<username> \
DOCKER_PASSWORD=<password> \
./li-release tag-publish-docker-image \
  DOCKER_SLUG \
  DOCKER_LOCAL_IMAGE \
  GIT_BRANCH \
  PULL_REQUEST_NUMBER \
  COMMIT_HASH
```

### Running the tests
```bash
npm test
```

## Copyright

Copyright (c) 2017 Livingdocs AG, all rights reserved

It is not permitted to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of this Software ('release-managers'), except when explicitly stated otherwise by Livingdocs AG.
