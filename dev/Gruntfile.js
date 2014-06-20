module.exports = function (grunt) {

    // Project configuration.
    grunt.initConfig({

        // Metadata.
        pkg: grunt.file.readJSON('package.json'),

        // Task configuration.
        connect: {
            options: {
                base: './../',
                port: 9000,
                livereload: 35729,
                hostname: 'localhost'
            },
            livereload: {
                options: {
                    open: {
                        target: 'http://localhost:9000/'
                    }
                }
            }
        },

        stylus: {
            options: {
                use: [require('autoprefixer-stylus')],
            },
            compile: {
                src: 'styl/main.styl', // 1:1 file maping
                dest: 'css/main.css',

                options: {
                    compress: false
                }
            }
        },

        targethtml: {
            dev: {
                files: {
                    '../index.html': 'index.dev.html'
                }
            },

            dist: {
                files: {
                    '../index.html': 'index.dev.html'
                },
                options: {
                    curlyTags: {
                        rlsdate: '<%= grunt.template.today("yyyymmddhhmm") %>'
                    }
                }
            }
        },

        watch: {
            stylus: {
                files: 'styl/*.styl',
                tasks: ['stylus:compile'],
                options: {
                    livereload: true
                }
            },
            dev: {
                files: ['Gruntfile.js', 'styl/*.styl', '*.html'],
                tasks: ['targethtml:dev', 'stylus:compile'],
                options: {
                    livereload: true
                }
            },
            bootstrap: {
                files: ['bower_components/bootstrap-stylus/stylus/*.styl'],
                tasks: ['run_grunt:bootstrap'],
                options: {
                    livereload: true
                }

            }
        },

        concat: {
            options: {
                stripBanners: true,
            },
            css: {
                src: ['bower_components/normalize.css/normalize.css', 'bower_components/bootstrap-stylus/dist/bootstrap.css', 'css/main.css'], // x:1 file maping
                dest: '../dist/css/main.css'
            }
        },

        cssmin: {
            dist: {
                src: '../dist/css/main.css',
                dest: '../dist/css/main.min.css',
                options: {
                    banner: '/*! Created on <%= grunt.template.today("dd-mm-yyyy hh:mm") %> \n' +
                        '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %> \n */\n',
                    keepSpecialComments: 0
                }
            }

        },


        bowerInstall: {
            target: {
                src: [
                    'index.dev.html' // .html support...
                ],
                fileTypes: {
                    html: {
                        replace: {
                            js: function (filePath) {
                                return '<script src="dev/' + filePath + '"></script>';
                            },
                            css: function (filePath) {
                                return '<link href="stylesheet" src="dev/' + filePath + '"></link>';
                            }
                        }
                    }
                }
            }
        },
        run_grunt: {
            bootstrap: {
                options: {
                    task: ['dist']
                },

                src: ['bower_components/bootstrap-stylus/Gruntfile.js']
            }
        }
    });

    // These plugins provide necessary tasks.
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-stylus');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-targethtml');
    grunt.loadNpmTasks('grunt-bower-install');
    grunt.loadNpmTasks('grunt-run-grunt');


    // Default task.
    grunt.registerTask('dev', ['bowerInstall', 'targethtml:dev', 'connect', 'watch:dev']);
    grunt.registerTask('dist', ['targethtml:dist', 'run_grunt:bootstrap', 'stylus:compile', 'concat:css', 'cssmin']);

};
