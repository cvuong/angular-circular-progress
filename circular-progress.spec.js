describe('Circular Progress Directive', function() {
  var $compile,
      $rootScope;

  beforeEach(module('app'));

  beforeEach(inject(function(_$compile_, _$rootScope_) {
    $compile = _$compile_;
    $rootScope = _$rootScope_;
  }));

  it('should format float 1.0 to 1.0', function() {
    var element = $compile('<circular-progress></circular-progress>')($rootScope);
    $rootScope.$digest();
    var scope = element.children().scope();
    var output = scope.formatInput(1.0);
    expect(output).toEqual(1.0);
  });

  it('should format float 0.5 to 0.5', function() {
    var element = $compile('<circular-progress></circular-progress>')($rootScope);
    $rootScope.$digest();
    var scope = element.children().scope();
    var output = scope.formatInput(0.5);
    expect(output).toEqual(0.5);
  });

  it('should format float 0 to 0', function() {
    var element = $compile('<circular-progress></circular-progress>')($rootScope);
    $rootScope.$digest();
    var scope = element.children().scope();
    var output = scope.formatInput(0);
    expect(output).toEqual(0);
  });

  it('should format float -0.5 to 0', function() {
    var element = $compile('<circular-progress></circular-progress>')($rootScope);
    $rootScope.$digest();
    var scope = element.children().scope();
    var output = scope.formatInput(-0.5);
    expect(output).toEqual(0);
  });

  it('should format float 2.0 to 1', function() {
    var element = $compile('<circular-progress></circular-progress>')($rootScope);
    $rootScope.$digest();
    var scope = element.children().scope();
    var output = scope.formatInput(2.0);
    expect(output).toEqual(1);
  });

  it('should get percentage string 78 from 0.78', function() {
    var element = $compile('<circular-progress></circular-progress>')($rootScope);
    $rootScope.$digest();
    var scope = element.children().scope();
    var output = scope.getPctString(0.78);
    expect(output).toEqual('78');
  });

  it('should get percentage string 79% from 0.788888', function() {
    var element = $compile('<circular-progress></circular-progress>')($rootScope);
    $rootScope.$digest();
    var scope = element.children().scope();
    var output = scope.getPctString(0.788888);
    expect(output).toEqual('79');
  });

  it('should get percentage string 100% from 1.01', function() {
    var element = $compile('<circular-progress></circular-progress>')($rootScope);
    $rootScope.$digest();
    var scope = element.children().scope();
    var formatted = scope.formatInput(1.01);
    var output = scope.getPctString(formatted);
    expect(output).toEqual('100');
  });

  it('should get percentage string 0% from -0.50', function() {
    var element = $compile('<circular-progress></circular-progress>')($rootScope);
    $rootScope.$digest();
    var scope = element.children().scope();
    var formatted = scope.formatInput(-0.50);
    var output = scope.getPctString(formatted);
    expect(output).toEqual('0');
  });

  it('should get green color when actual/expected diff is +30', function() {
    var element = $compile('<circular-progress></circular-progress>')($rootScope);
    $rootScope.$digest();
    var scope = element.children().scope();
    var color = scope.getActualProgressEndColor(70, 40);
    expect(color).toEqual('#64BA00');
  });

  it('should get orange color when actual/expected diff is -26', function() {
    var element = $compile('<circular-progress></circular-progress>')($rootScope);
    $rootScope.$digest();
    var scope = element.children().scope();
    var color = scope.getActualProgressEndColor(10, 36);
    expect(color).toEqual('#FFA500');
  });

  it('should get orange color when actual/expected diff is -51', function() {
    var element = $compile('<circular-progress></circular-progress>')($rootScope);
    $rootScope.$digest();
    var scope = element.children().scope();
    var color = scope.getActualProgressEndColor(10, 61);
    expect(color).toEqual('#FF0000');
  });
});
