const path = require('path');
const fse = require('fs-extra');
const glob = require('glob');
const { minify } = require('html-minifier-terser');

const dist = path.resolve(__dirname, './dist');
fse.ensureDirSync(dist);
fse.emptyDirSync(dist);

const files = [
  path.resolve(__dirname, './evolve'),
  path.resolve(__dirname, './font'),
  path.resolve(__dirname, './lib'),
  path.resolve(__dirname, './strings'),
  path.resolve(__dirname, './wiki'),
  path.resolve(__dirname, './evolved-light.ico'),
  path.resolve(__dirname, './evolved.ico'),
  path.resolve(__dirname, './index.html'),
  path.resolve(__dirname, './save.html'),
  path.resolve(__dirname, './wiki.html'),
];

files.forEach((file) => {
  fse.copySync(file, path.resolve(dist, path.basename(file)));
});

// delete py files
const pyfiles = glob.sync('dist/**/*.py', { cwd: __dirname });
pyfiles.forEach((file) => {
  fse.removeSync(path.resolve(__dirname, file));
});
const mdfiles = glob.sync('dist/**/*.md', { cwd: __dirname });
mdfiles.forEach((file) => {
  fse.removeSync(path.resolve(__dirname, file));
});

// minify html
const htmlfiles = glob.sync('dist/**/*.html', { cwd: __dirname });
htmlfiles.forEach(async (file) => {
  const html = fse.readFileSync(path.resolve(__dirname, file), 'utf8');
  const result = await minify(html, {
    collapseBooleanAttributes: true,
    collapseInlineTagWhitespace: true,
    collapseWhitespace: true,
    minifyCSS: true,
    minifyJS: true,
    removeComments: true,
  });
  fse.writeFileSync(path.resolve(__dirname, file), result);
});

// minify json
const jsonfiles = glob.sync('dist/**/*.json', { cwd: __dirname });
jsonfiles.forEach((file) => {
  const json = fse.readFileSync(path.resolve(__dirname, file), 'utf8');
  const result = JSON.stringify(JSON.parse(json));
  fse.writeFileSync(path.resolve(__dirname, file), result);
});