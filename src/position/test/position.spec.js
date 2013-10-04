describe('position service', function () {

  var $position, $document, $body, elem;
  beforeEach(module('ui.bootstrap.position'));
  beforeEach(inject(function(_$position_, _$document_) {
    $position = _$position_;
    $document = _$document_;
    $body = $document.find('body');
  }));

  beforeEach(function() {
    elem = angular.element('<div><p>Miscellaneous content</p></div>');
    ['height', 'width'].forEach(function(name) {
      ['', 'min-', 'max-'].forEach(function(prefix) {
        elem.css(prefix+name, '100px');
      });
    });
    $body.append(elem);
  });
  afterEach(function() {
    elem.remove();
  });

  describe('$position.width', function() {
    it('will be a function', function() {
      expect(typeof $position.width).toEqual('function');
    });

    it('will return correct dimensions with `display: none`', function() {
      elem.css('display', 'none');
      expect($position.width(elem)).toEqual(100);
      expect(elem[0].offsetWidth).toBe(0);
    });

    it('will return correct dimensions with `visibility: hidden`', function() {
      elem.css({'visibility': 'hidden', 'display': 'none'});
      expect($position.width(elem)).toEqual(100);
      expect(elem[0].offsetWidth).toBe(0);
    });

    it('will return correct dimensions with `display: block`', function() {
      expect($position.width(elem)).toEqual(100);
      expect(elem[0].offsetWidth).toBe(100);
    });
  });

  describe('$position.height', function() {
    it('will be a function', function() {
      expect(typeof $position.height).toEqual('function');
    });

    it('will return correct dimensions with `display: none`', function() {
      elem.css('display', 'none');
      expect($position.height(elem)).toEqual(100);
      expect(elem[0].offsetHeight).toBe(0);
    });

    it('will return correct dimensions with `visibility: hidden`', function() {
      elem.css({'visibility': 'hidden', 'display': 'none'});
      expect($position.height(elem)).toEqual(100);
      expect(elem[0].offsetHeight).toBe(0);
    });

    it('will return correct dimensions with `display: block`', function() {
      expect($position.height(elem)).toEqual(100);
      expect(elem[0].offsetHeight).toBe(100);
    });
  });

});
