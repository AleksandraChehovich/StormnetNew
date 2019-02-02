'use strict';
/*
1. npm install gulp-cli -g
2. npm install -D gulp node-sass gulp-sass gulp-sourcemaps gulp-autoprefixer gulp-concat browser-sync 
3. Положить gulpfile.js из чата Stormnet frontend в корень проекта
4. Отредактировать пути в gulpfile.js (path_to_main_scss_file, scss_path_to_watch, final_css_name)
5. Изменить в вашем index.html путь до подключаемого css (теперь он лежит в папке dist/style.css)

После всех шагов пишем в консоль команду gulp
- все scss файлы проимпортированные в главном scss файле превратятся в css и положится в папку dist
- стартует локальный сервер и открывается браузер с url http://localhost:3000/
- ваша вёрстка теперь доступна по данному url и обновляется при любых изменениях html, и !!!любой из зависимостей вашего главного scss файла
- просто сворачиваем запущенную консоль - и продолжаем работать. 
  gulp за всем следит и пересобирает ваш scss + обновляет за вас браузер (ура! рутина автоматизирована)

не забудьте удалить оба плагина для vscode - они больше не нужны + vscode будет загружаться чуть быстрее (т.к. ему не надо инитить свои плагины)
*/

const path_to_main_scss_file = 'styles/style.scss'; // путь до главного scss файла
const scss_path_to_watch = 'styles/**/*.scss'; // наблюдать за изменениями во всех папках в папке 'styles', scss с любым именем файла
const destination_path = 'dist/'; // папка куда положить итоговый css
const final_css_name = 'style.css'; // имя итоговогой файла


const gulp         = require('gulp');
const sass         = require('gulp-sass');
const sourcemaps   = require('gulp-sourcemaps');
const autoprefixer = require('gulp-autoprefixer');
const concat       = require('gulp-concat');
const browserSync  = require('browser-sync').create();
const browser_list = ['last 2 versions', 'ie >= 10'];

function sync() {
	browserSync.init({
		server: {
			baseDir: './'
		}
	});

	gulp.watch(scss_path_to_watch, {ignoreInitial: false}, build_sass);
	gulp.watch("./*.html").on('change', browserSync.reload);
}

function build_sass() {
	return gulp.src(path_to_main_scss_file) // get scss file from path
	.pipe(sourcemaps.init()) // init sourcemaps (for resolving from which scss file your css selector was built) http://prntscr.com/m6rj2p
	.pipe(sass().on('error', sass.logError)) // compile scss to css
	.pipe(sourcemaps.write()) // write sourcemaps to css files
	.pipe(concat(final_css_name)) // concatenate all compiled css files to 1 file
	.pipe(autoprefixer({browsers: browser_list})) // add vendor prefixes
    .pipe(gulp.dest(destination_path)) // put final css to destination path
    .pipe(browserSync.stream()); // reload browser
}

exports.default = sync;