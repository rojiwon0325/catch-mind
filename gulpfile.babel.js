import gulp from "gulp";
import sass from "gulp-sass";
import autoprefixer from "gulp-autoprefixer";
import del from "del";
import babel from "babelify";
import bro from "gulp-bro";

const paths = {
    styles: {
        src: "assets/scss/styles.scss",
        dest: "src/static/styles",
        watch: "assets/scss/"
    },
    scripts: {
        src: "assets/scripts/main.js",
        dest: "src/static/scripts",
        watch: "assets/scripts/"
    }
}

const clean = () => del("/src/static");

const styles = () => gulp
    .src(paths.styles.src)
    .pipe(sass())
    .pipe(
        autoprefixer({
            cascade: false
        })
    )
    .pipe(gulp.dest(paths.styles.dest));

const scripts = () => gulp
    .src(paths.scripts.src)
    .pipe(bro({
        transfrom: [
            babel.configure({
                presets: ["@babel/preset-env", "@babel/preset-react"]
            })
        ]
    }))
    .pipe(gulp.dest(paths.scripts.dest));

function watchFiles() {
    gulp.watch(paths.styles.watch, styles);
    gulp.watch(paths.scripts.watch, scripts);
}


const build = gulp.series(clean, gulp.parallel(styles, scripts, watchFiles));

export default build;