'use strict';

const SRError = require('@semantic-release/error');

module.exports = (pluginConfig, config, cb) => {
	const type = config.nextRelease.type;

	// Only allow a patch or initial release
	if (type === 'patch' || type === 'initial') {
		cb(null);
		return;
	}

	cb(new SRError(
		`a 'minor' or a 'major' release is not allowed in a maintenance branch.\n` +
		`Please update your commit messages in the maintenance branch.`
	));
};
