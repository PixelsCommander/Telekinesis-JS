module.exports = function (grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: {
            options: {
                separator: ';'
            },
            server: {
                src: [
                    'src/universal/polyfills.js',
                    'src/universal/core.js',
                    'src/universal/scene.js',
                    'src/server/playersocket.js',
                    'src/server/server.js'
                ],
                dest: './dist/<%= pkg.name %>server.js'
            },
            client: {
                src: [
                    'src/universal/polyfills.js',
                    'src/universal/core.js',
                    'src/universal/scene.js',
                    'src/client/client.js'
                ],
                dest: './dist/<%= pkg.name %>client.js'
            }
        },
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            server: {
                src: 'dist/<%= pkg.name %>server.js',
                dest: 'dist/<%= pkg.name %>server.min.js'
            },
            client: {
                src: 'dist/<%= pkg.name %>client.js',
                dest: 'dist/<%= pkg.name %>client.min.js'
            }
        },
        jshint: {
            files: ['src/**/*.js'],
            options: {
                asi: true,
                globals: {
                    jQuery: true,
                    console: true,
                    module: true,
                    document: true
                }
            }
        },
        jsdoc: {
            dist: {
                src: ['src/**/*.js', 'test/*.js'],
                options: {
                    destination: 'doc'
                }
            }
        },
        watch: {
            files: ['<%= jshint.files %>'],
            tasks: ['jshint', 'concat', 'uglify']
        }
    });

    // Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-jsdoc');

    // Default task(s).
    grunt.registerTask('default', ['jshint', 'concat:client', 'uglify:client', 'concat:server', 'uglify:server']);
    grunt.registerTask('doc', ['jshint', 'jsdoc', 'concat', 'uglify']);

};