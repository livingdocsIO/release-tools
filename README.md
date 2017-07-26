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

#### Execution example for a release branch
```bash  
docker_username=dev@li.io \
docker_password=1234567 \
remote_image_name=livingdocs/service-server \
local_image_name_and_tag=server:test \
branch_name=release-7 \
pull_request_number='' \
commit_sha=rea0a2f \
git_tag=v4.2.0 \
./bin/tag-publish-docker-image
```

### Running the tests
```bash
npm test
```

## Copyright

Copyright (c) 2017 Livingdocs AG, all rights reserved

It is not permitted to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of this Software ('release-managers'), except when explicitly stated otherwise by Livingdocs AG.
