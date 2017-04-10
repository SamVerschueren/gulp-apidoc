'use strict';
const fs = require('fs');
const path = require('path');
const f = require('file');
const gutil = require('gulp-util');
const through = require('through2');
const apidoc = require('apidoc');
const tempfile = require('tempfile');
const pathExists = require('path-exists');

module.exports = options => {
	options = options || {};

	const include = [];
	const exclude = [];
	let base;

	return through.obj((file, enc, cb) => {
		if (file.isStream()) {
			// The plugin does not support streaming
			cb(new gutil.PluginError('gulp-api-doc', 'Streaming not supported'));
			return;
		}

		if (base !== undefined && base !== file.base) {
			// It's only possible to generate documentation by staying in the same base folder
			cb(new gutil.PluginError('gulp-api-doc', 'Could not generate apidoc from different folders.'));
			return;
		}

		if (file.isDirectory()) {
			// If the file is a directory, take the entire path
			base = file.path;
		} else {
			// If the file provided is not a directory, the base is the base of the file
			base = file.base;

			// Push the relative path from the base to the file in the includes array
			include.push(path.relative(base, file.path));
		}

		cb();
	}, function (cb) {
		if (base === undefined) {
			cb(new gutil.PluginError('gulp-api-doc', 'Please provide some files.'));
			return;
		}

		// This is the temporary directory where the documentation will be stored
		const tempPath = tempfile();

		if (include.length > 0) {
			// Only traverse over all the files to determine the excluded files if we have
			// included files. If we don't have include files, it probably means the user provided
			// us with a directory and he wants to include the entire directory.
			f.walkSync(base, (dirPath, dirs, files) => {
				// Iterate over every file and if it's not in the included list, it should be
				// excluded.
				files.forEach(file => {
					const relPath = path.relative(base, path.join(dirPath, file));

					if (include.indexOf(relPath) === -1) {
						exclude.push(relPath);
					}
				});
			});
		}

		// Generate the documentation
		const isGenerated = apidoc.createDoc({
			src: base,
			dest: tempPath,
			includeFilters: include.length > 0 ? include : undefined,
			excludeFilters: exclude.length > 0 ? exclude : undefined,

			// Set the options provided by the devleoper
			template: options.template,
			debug: options.debug === true,
			silent: options.silent === true,
			markdown: options.markdown !== false,
			marked: options.marked,
			config: options.config
		});

		if (!isGenerated) {
			// Throw an error if it failed to generate
			cb(new gutil.PluginError('gulp-api-doc', 'Could not generate the documentation'));
			return;
		}

		if (pathExists.sync(tempPath)) {
			// Retrieve all files recursively in the temporary directory
			f.walkSync(tempPath, (dirPath, dirs, files) => {
				// Iterate over the files and create a File object
				files.forEach(file => {
					const content = fs.readFileSync(path.join(dirPath, file));

					this.push(new gutil.File({
						base: tempPath,
						cwd: tempPath,
						path: path.join(dirPath, file),
						contents: Buffer.from(content)
					}));
				});
			});
		}

		cb();
	});
};
