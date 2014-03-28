
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({

    // Metadata.
    pkg: grunt.file.readJSON('package.json'),
    banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n',
    // Task configuration.
    clean: {
      dist: ['public']
    },

    concat: {
      options: {
        banner: '<%= banner %>',
        stripBanners: false
      },
     bootstrap: {
        src: [
          'source/bootstrap/js/transition.js',
          'source/bootstrap/js/alert.js',
          'source/bootstrap/js/button.js',
          'source/bootstrap/js/carousel.js',
          'source/bootstrap/js/collapse.js',
          'source/bootstrap/js/dropdown.js',
          'source/bootstrap/js/modal.js',
          'source/bootstrap/js/tooltip.js',
          'source/bootstrap/js/popover.js',
          'source/bootstrap/js/scrollspy.js',
          'source/bootstrap/js/tab.js',
          'source/bootstrap/js/affix.js'
        ],
        dest: 'public/resource/js/bootstrap.js'
      }
    },

    uglify: {
      options: {
        banner: '<%= banner %>',
        report: 'min'
      },
      bootstrap: {
        src: ['<%= concat.bootstrap.dest %>'],
        dest: 'public/resource/js/bootstrap.min.js'
      }
    },

    recess: {
      options: {
        compile: true,
        banner: '<%= banner %>'
      },
     /* bootstrap: {
        src: ['source/bootstrap/less/bootstrap.less'],
        dest: 'public/resource/css/bootstrap.css'
      },
      min: {
        options: {
          compress: true
        },
        src: ['source/bootstrap/less/bootstrap.less'],
        dest: 'public/resource/css/bootstrap.min.css'
      },*/
      custom: {
        src: ['source/less/custom.less'],
        dest: 'public/resource/css/<%= pkg.name %>.css'
      },
      custom_min: {
        options: {
          compress: true
        },
        src: ['source/less/custom.less'],
        dest: 'public/resource/css/<%= pkg.name %>.min.css'
      },      
    },

    copy: {
     /* fonts: {
        expand: true,
        src: ["source/bootstrap/fonts/*"],
        dest: 'public/resource/fonts'
      },*/
      images: {
        expand: true,
        src: ["source/img/*"],
        dest: 'public/resource/img',
        flatten:true
      },
      vendorjs: {
        expand: true,
        src: ["source/js/vendor/*"],
        dest: 'public/resource/js',
        flatten:true
      },
      customjs:{
        expand:true,
        src: ["source/js/*.js"],
        dest: 'public/resource/js',
        flatten:true,        
      },
      foundation:{
        expand:true,
        src: ["source/foundation/*.css"],
        dest: 'public/resource/css',
        flatten:true,        
      }
    },
    watch: {
      css: {
        files: 'source/**/*.less',
        tasks: ['recess'],
      },
      js:{
        files: 'source/**/*.js',
        tasks: ['copy:customjs'],
      },
    },
  });


  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');  
  grunt.loadNpmTasks('grunt-recess');

  // JS distribution task.
  grunt.registerTask('dist-js', ['concat', 'uglify']);

  // CSS distribution task.
  grunt.registerTask('dist-css', ['recess']);

  // Fonts/Image distribution task.
  grunt.registerTask('dist-fonts', ['copy']);

  // Full distribution task.
  grunt.registerTask('default', ['clean', 'dist-css', 'dist-fonts']);

  grunt.event.on('watch', function(action, filepath, target) {
    grunt.log.writeln(target + ': ' + filepath + ' has ' + action);
  });
};
