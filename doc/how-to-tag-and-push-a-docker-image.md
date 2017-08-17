# How to Tag and Push a Docker Image

`li-release tag-publish-docker-image` is a helper to tag and publish a docker image. Based on the argument you pass, your image will be tagged with 1 or more tags and then pushed.

## Test Mode

If you want to make a dry run without executing the script, you can pass a test parameter `li-release tag-publish-docker-image --dry-run` to the script. 



DOCKER_USERNAME=livingdocsdev DOCKER_PASSWORD=mVcqeQZwJojGLodXDJ8ar8EkWfNAdajP REMOTE_IMAGE_NAME=livingdocs/service-editor LOCAL_IMAGE_NAME_AND_TAG=livingdocs/service-editor:test COMMIT_TAG=2.0.10 COMMIT_SHA=1234 li-release tag-publish-docker-image --dry-run



# Status update after first review

## Feature branch named myfeat

#### Command
```bash
DOCKER_USERNAME=dev@li.io \
DOCKER_PASSWORD=1234567 \
REMOTE_IMAGE_NAME=livingdocs/service-server \
LOCAL_IMAGE_NAME_AND_TAG=server:test \
GIT_BRANCH=master \
PULL_REQUEST_NUMBER=myfeat \
COMMIT_SHA=fea0a2f \
COMMIT_TAG=false \
./bin/tag-publish-docker-image --dry-run
```
#### Main output
```bash
  docker push livingdocs/service-server:hash-fea0a2f
  docker push livingdocs/service-server:feature-myfeat-hash-fea0a2f
```

## Merging in the master branch

#### Command
```bash
DOCKER_USERNAME=dev@li.io \
DOCKER_PASSWORD=1234567 \
REMOTE_IMAGE_NAME=livingdocs/service-server \
LOCAL_IMAGE_NAME_AND_TAG=server:test \
GIT_BRANCH=master \
PULL_REQUEST_NUMBER='' \
COMMIT_SHA=ma0a2fd \
COMMIT_TAG=false \
./bin/tag-publish-docker-image --dry-run
```

#### Main output
```bash
docker push livingdocs/service-server:hash-ma0a2fd
```

## Merging in the release branch named release-7 tagged v4.2.0

#### Command
```bash
DOCKER_USERNAME=dev@li.io \
DOCKER_PASSWORD=1234567 \
REMOTE_IMAGE_NAME=livingdocs/service-server \
LOCAL_IMAGE_NAME_AND_TAG=server:test \
GIT_BRANCH=release-7 \
PULL_REQUEST_NUMBER='' \
COMMIT_SHA=rea0a2f \
COMMIT_TAG=v4.2.0 \
./bin/tag-publish-docker-image --dry-run
```

#### Main output
```bash
docker push livingdocs/service-server:hash-rea0a2f
docker push livingdocs/service-server:release-release-7-tag-v4.2.0
```


### Tag and publish a Docker image

#### Execution example for a release branch
```bash  
DOCKER_USERNAME=dev@li.io \
DOCKER_PASSWORD=1234567 \
REMOTE_IMAGE_NAME=livingdocs/service-server \
LOCAL_IMAGE_NAME_AND_TAG=server:test \
BRANCH_NAME=release-7 \
PULL_REQUEST_NUMBER='' \
COMMIT_SHA=rea0a2f \
COMMIT_TAG=v4.2.0 \
./bin/tag-publish-docker-image
```
