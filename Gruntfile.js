

module.exports = function(grunt) {

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('cssmodeling');
    grunt.loadNpmTasks('grunt-sass');

    var configObj = {
        pkg: '<json:package.json>'
    };

    /*==========================
    CSSMODELING
    ==========================*/
    configObj.cssmodeling = configObj.cssmodeling || {};
    configObj.cssmodeling["cpp"] = {
        files: {
            'dist/cssmodel/':
            [
                'node_modules/cssmodeling-styles/models/cols/col12ltr_cssmodel.json',
                'node_modules/cssmodeling-styles/models/rows/row16ltr_cssmodel.json',
                'node_modules/cssmodeling-styles/models/simple/smpl_cssmodel.json',
                'node_modules/cssmodeling-styles/models/flex/flx_cssmodel.json'
            ]
        },
        options: {type:"scss"}
    };


    /*=============================
    SASS
    =============================*/
    configObj.sass = configObj.sass || {};
    configObj.sass["cpp"] = {
        files: {
            'dist/chrome-print-paginator.css':
            [
                'chrome-print-paginator.scss'
            ]
        }
    };

    /*=============================
    CONCAT
    =============================*/
    configObj.concat = configObj.concat || {};
    configObj.concat["cpp"] = {files:{}};
    configObj.concat["cpp"]
        .files['dist/chrome-print-paginator.js']
            = [
                'node_modules/jquery/dist/jquery.min.js',
                'chrome-print-paginator.js'
            ];


    /*=============================
    WATCH
    =============================*/
    configObj.watch = configObj.watch || {};
    configObj.watch["cpp"] = {
        files:[
            'chrome-print-paginator.scss',
            'chrome-print-paginator.js'
        ],
        tasks: ["default"]
    };


    grunt.initConfig( configObj );
    grunt.registerTask( 'default' , [
        'cssmodeling','sass','concat'
    ] );

}
