# Release Tools

[![Greenkeeper badge](https://badges.greenkeeper.io/upfrontIO/release-tools.svg)](https://greenkeeper.io/)

The release tools are a bunch of command line tools to maintain a release. These tools are usually used by a release manager.

## Usage

#### Preconditions
Have [`npx`](https://www.npmjs.com/package/npx) installed with `npm install -g npx`

#### List of available commands
`npx release-tools`


#### Create Release Branch

**Introduction**
When you want to manage a product with different releases and support old version with patches, you can not just use semver on master. You also have to work with release branches to support old versions. A more detailed explanation with an example can be found [here](./doc/how-to-handle-a-product-release-on-github.md)

**Commands**
* Help: `npx @livingdocs/release-tools@<version> create-release-branch`
* Command (simple example): `npx @livingdocs/release-tools@<version> create-release-branch --base-tag=v1.0.1 --release-branch-name=release-2017-10 --npm-token=<token>`


## Examples

- [How to Handle a Customer Release on Github](./doc/how-to-handle-a-release-on-github.md)

## Run the tests
```bash
npm test
```


## Copyright

Copyright (c) 2018 Livingdocs AG, all rights reserved

It is not permitted to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of this Software ('release-tools'), except when explicitly stated otherwise by Livingdocs AG.
