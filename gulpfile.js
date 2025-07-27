const { src, dest, parallel, watch } = require('gulp'),
	browserSync = require('browser-sync').create(),
	concat = require('gulp-concat'),
	uglify = require('gulp-uglify-es').default,
	sass = require('gulp-sass')(require('sass')),
	autoprefixer = require('gulp-autoprefixer'),
	cleancss = require('gulp-clean-css'),
	htmlmin = require('gulp-htmlmin'),
	imagemin = require('gulp-imagemin'),
	svgmin = require('gulp-svgmin');

const srcDir = 'src', distDir = 'dist', nodeDir = 'node_modules';

const path = {
	
    js:{
        dist: `${distDir}/bundle/`,
		node: [],
        src: `${srcDir}/js/**/*.js`,
        watch: `${srcDir}/js/**/*.js`
    },

    sass:{
        dist: `${distDir}/bundle/`,
		node: [],
        src: `${srcDir}/sass/styles.sass`,
        watch: `${srcDir}/sass/**/*.sass`
    },

    html:{
        dist: `${distDir}/`,
        src: `${srcDir}/html/*.html`,
        watch: `${srcDir}/html/*.html`
    },

	fonts:{
		dist: `${distDir}/fonts/`,
        src: `${srcDir}/fonts/**/*.{woff,woff2,eot,ttf}`,
	},

	img: {
		src: `${srcDir}/images/**/*.{jpg,jpeg,png}`,
		watch: `${srcDir}/images/**/*.{jpg,jpeg,png}`,
		dist: `${distDir}/images/`
	},

	svg: {
		src: `${srcDir}/images/*/*.svg`,
		watch: `${srcDir}/images/*/*.svg`,
		dist: `${distDir}/images/`
	}
}

function getPath(type){
	
	let temp = [];

	for(let item of path[type]['node']){
		temp.push(item);
	}

	temp.push(path[type].src);

	return temp

}

function browsersync() {

	browserSync.init({ 
		server: { baseDir: 'dist/' },  
		notify: false, 
		online: true  
	})

}

function html() {

    return src(path.html.src)
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(dest(path.html.dist))

}

function scripts() {

	return src(getPath('js'))
	.pipe(concat('bundle.min.js')) 
	.pipe(uglify()) 
	.pipe(dest(path.js.dist)) 
	.pipe(browserSync.stream()) 

}

function styles() {

	return src(getPath('sass')) 
	.pipe(sass()) 
	.pipe(concat('bundle.min.css')) 
	.pipe(autoprefixer({ overrideBrowserslist: ['last 10 versions'], grid: true })) 
	.pipe(cleancss( { level: { 1: { specialComments: 0 } } } )) 
	.pipe(dest(path.sass.dist)) 
	.pipe(browserSync.stream())

}

function img() {

	return src( path.img.src )
		.pipe(imagemin())
		.pipe(dest( path.img.dist ))
		.pipe(browserSync.stream())

}

function svg() {

	return src( path.svg.src )
		.pipe(svgmin({
			js2svg:{
				pretty: true
			}
		}))
		.pipe(dest( path.svg.dist ))
		.pipe(browserSync.stream())

}

function fonts(){

	return src(path.fonts.src)
    .pipe(dest(path.fonts.dist))

}

function startwatch() {
 
	watch(path.js.watch, scripts);
	watch(path.sass.watch, styles);
    watch(path.html.watch, html).on('change', browserSync.reload);
    watch(path.img.watch, img);
    watch(path.svg.watch, svg);

}

exports.fonts = fonts;
exports.browserSync = browserSync;
exports.styles = styles;
exports.html = html;
exports.img = img;
exports.svg = svg;
exports.scripts = scripts;
exports.build = parallel(fonts, html, svg, img, styles, scripts);
exports.default = parallel(fonts, html, svg, img, styles, scripts, browsersync, startwatch);
