# gulp-api-doc [![Build Status](http://img.shields.io/travis/SamVerschueren/gulp-api-doc.svg)](https://travis-ci.org/SamVerschueren/gulp-api-doc)

> Generates a RESTful web API Documentation with [apiDoc](https://github.com/apidoc/apidoc).


## Installation

```
npm install --save-dev gulp-api-doc
```


## Usage

Generate documentation for the entire `controllers` directory.

```js
const gulp = require('gulp');
const apidoc = require('gulp-api-doc');

gulp.task('doc', () => {
    return gulp.src('controllers')
        .pipe(apidoc())
        .pipe(gulp.dest('documentation'));
});
```

Generate documentation for all the `controllers`, except for the ones in the `auth` folder and don't parse markdown statements.

```js
gulp.task('doc', () => {
    return gulp.src(['controllers/**/*.js', '!controllers/auth/*.js'])
        .pipe(apidoc({markdown: false}))
        .pipe(gulp.dest('documentation'));
});
```

### Options

- **template**: Directory with the template files.
- **config**: Directory containing config file (apidoc.json).
- **debug (false)**: Show debug output.
- **silent (false)**: Hide log output.
- **markdown (true)**: Parse markdown statements in the documentation.
- **marked**
    - **gfm (true)**: [Github flavored markdown](https://help.github.com/articles/github-flavored-markdown/).
    - **tables (true)**: Enables Github flavored markdown [tables](https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet#wiki-tables). This option requires ```gfm``` to be true.
    - **breakes (false)**: Enabled Github flavored markdown [line breaks](https://help.github.com/articles/github-flavored-markdown#newlines).
    - **pedantic (false)**: Conform to obscure parts of [markdown.pl](http://markdown.pl) as much as possible. Don't fix any of the original markdown bugs or poor behavior.
    - **sanitize (false)**: Sanitize the output. Ignore any HTML that has been input.
    - **smartLists (true)**: Use smarter list behaviour than the original markdown.
    - **smartypants (false)**: Use "smart" typographic punctuation for things like quotes and dashes.


## License (MIT)

MIT © [Sam Verschueren](http://github.com/SamVerschueren)
