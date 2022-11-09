/*jshint node:true*/

const {FONT_NAME} = process.env

module.exports = function (grunt) {
    'use strict';

    require('load-grunt-tasks')(grunt);
    const packageJSON = grunt.file.readJSON('package.json');

    grunt.initConfig({
        webfont: {
            [FONT_NAME]: {
                src: 'build/glyphs/*.svg',
                dest: 'build/raw-font',
                options: {
                    font: FONT_NAME,
                    engine: 'fontforge',
                    types: 'ttf',
                    autoHint: false,
                    /* 单步执行任务时,标准输出会溢出,增大它 */
                    execMaxBuffer: 1024 * 1000 * 1024,
                    /* 打开ligatures连字符, 和字符串名对应的关键 */
                    ligatures: true,
                    version: packageJSON.version,
                    codepointsFile: 'build/codepoints.json'
                }
            },
        },
    });

    grunt.loadNpmTasks('grunt-webfonts');
    grunt.registerTask('default', ['webfont']);
};
