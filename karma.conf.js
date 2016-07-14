module.exports = function(config) {
  config.set({
    files: [
      'node_modules/angular/angular.min.js',
      'node_modules/angular-mocks/angular-mocks.js',
      'node_modules/d3/build/d3.min.js',
      'app.js',
      'circular-progress.directive.js',
      'circular-progress.spec.js'
    ],

    browsers: ['Chrome'],

    frameworks: ['jasmine'],

    plugins: [
      'karma-chrome-launcher',
      'karma-jasmine'
    ]
  });
}
