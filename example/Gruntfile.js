

module.exports = function(grunt) {

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-sass');

    var configObj = {
        pkg: '<json:package.json>'
    };

    /*=============================
    SASS
    =============================*/
    configObj.sass = configObj.sass || {};
    configObj.sass["cpp-simple-example"] = {
        files: {
            'SimpleExample.css':
            [
                'SimpleExample.scss'
            ]
        }
    };
    configObj.sass["cpp-nested-section-example"] = {
        files: {
            'NestedSectionExample.css':
            [
                'NestedSectionExample.scss'
            ]
        }
    };


    /*=============================
    WATCH
    =============================*/
    configObj.watch = configObj.watch || {};
    configObj.watch["cpp-example"] = {
        files:[
            'SimpleExample.scss',
            'NestedSectionExample.scss'
        ],
        tasks: ["default"]
    };


    grunt.initConfig( configObj );
    grunt.registerTask( 'default' , [
        'sass'
    ] );

}
