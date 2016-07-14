describe('Circular Progress Directive', function() {
  var $compile,
      $rootScope;

  beforeEach(module('app'));

  beforeEach(inject(function(_$compile_, _$rootScope_) {
    $compile = _$compile_;
    $rootScope = _$rootScope_;
  }));

  it('test', function() {
    var element = $compile('<circular-progress actual="0.50" expected="0.15"></circular-progress>')($rootScope);
    $rootScope.$digest();
    var scope = element.children().scope();
  });
});
