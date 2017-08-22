const test = require('tape')
const validateRelease = require('../../js/validate_release')

function stubProperty (obj, prop, val) {
  const oldValue = obj[prop]
  obj[prop] = val
  return {
    restore: function () { obj[prop] = oldValue }
  }
}

const mockedGitTags = ['1.0.0', '1.0.1', '1.0.2', '2.0.0', '2.0.1', '2.1.0', '4.0.0', '4.2.0']
const stubListGitTags = stubProperty(validateRelease, 'listGitTags', function (callback) {return callback(null, mockedGitTags)})

test('mocked listGitTags()', function (t) {
  t.plan(1)
  validateRelease.listGitTags(function(err, versions) {
    if (err) {
      return t.end(err)
    }
    t.deepEqual(versions, mockedGitTags)
  })
});

test('version is the latest version and has a minor or major successor version', function (t) {
  t.plan(4)
  t.true(validateRelease.patch('1.0.2', mockedGitTags))
  t.true(validateRelease.patch('v1.0.2', mockedGitTags))
  t.true(validateRelease.patch('2.0.1', mockedGitTags))
  t.true(validateRelease.patch('v2.0.1', mockedGitTags))
})

test('version is NOT the latest version', function (t) {
  t.plan(3)
  t.false(validateRelease.patch('1.0.0', mockedGitTags))
  t.false(validateRelease.patch('1.0.1', mockedGitTags))
  t.false(validateRelease.patch('2.0.0', mockedGitTags))
})

test('version has NOT a minor or major version a successor', function (t) {
  t.plan(2)
  t.false(validateRelease.patch('2.1.0', mockedGitTags))
  t.false(validateRelease.patch('4.0.0', mockedGitTags))
})

test('version is not a valid semver string', function (t) {
  t.plan(1)
  t.false(validateRelease.patch('blubb', mockedGitTags))
})

test.onFinish(function () {
  stubListGitTags.restore()
})
