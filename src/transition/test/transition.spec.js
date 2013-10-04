
describe('$transition', function() {

  // Work out if we are running IE
  var ie = (function(){
      var v = 3,
          div = document.createElement('div'),
          all = div.getElementsByTagName('i');
      do {
        div.innerHTML = '<!--[if gt IE ' + (++v) + ']><i></i><![endif]-->';
      } while(all[0]);
      return v > 4 ? v : undefined;
  }());

  var $transition, $timeout;

  beforeEach(module('ui.bootstrap.transition'));

  beforeEach(inject(function(_$transition_, _$timeout_) {
    $transition = _$transition_;
    $timeout = _$timeout_;
  }));

  it('returns our custom promise', function() {
    var element = angular.element('<div></div>');
    var promise = $transition(element, '');
    expect(promise.then).toEqual(jasmine.any(Function));
    expect(promise.cancel).toEqual(jasmine.any(Function));
  });

  it('changes the css if passed a string', function() {
    var element = angular.element('<div></div>');
    spyOn(element, 'addClass');
    $transition(element, 'triggerClass');
    $timeout.flush();

    expect(element.addClass).toHaveBeenCalledWith('triggerClass');
  });

  it('remove the css class if passed a string starting with `-`', function() {
    var element = angular.element('<div class="foo"></div>');
    spyOn(element, 'removeClass');
    $transition(element, '-foo');
    $timeout.flush();

    expect(element.removeClass).toHaveBeenCalledWith('foo');
  });

  it('toggle (removeClass) the css class if passed a string starting with `^`', function() {
    var element = angular.element('<div class="foo"></div>');
    spyOn(element, 'removeClass');
    $transition(element, '^foo');
    $timeout.flush();
    expect(element.removeClass).toHaveBeenCalledWith('foo');
  });

  it('toggle (addClass) the css class if passed a string starting with `^`', function() {
    var element = angular.element('<div></div>');
    spyOn(element, 'addClass');
    $transition(element, '^foo');
    $timeout.flush();
    expect(element.addClass).toHaveBeenCalledWith('foo');
  });

  it('changes the css if passed array of strings', function() {
    var element = angular.element('<div></div>');
    spyOn(element, 'addClass');
    $transition(element, ['triggerClass', 'triggerClass2']);
    $timeout.flush();

    expect(element.addClass).toHaveBeenCalledWith('triggerClass');
    expect(element.addClass).toHaveBeenCalledWith('triggerClass2');
  });

  it('changes the style if passed an object', function() {
    var element = angular.element('<div></div>');
    var triggerStyle = { height: '11px' };
    spyOn(element, 'css');
    $transition(element, triggerStyle);
    $timeout.flush();
    expect(element.css).toHaveBeenCalledWith(triggerStyle);
  });

  it('changes the style and css if passed an object and string', function() {
    var element = angular.element('<div></div>');
    var triggerStyle = [{ height: '11px' }, 'triggerClass'];
    spyOn(element, 'css');
    spyOn(element, 'addClass');
    $transition(element, triggerStyle);
    $timeout.flush();
    expect(element.css).toHaveBeenCalledWith(triggerStyle[0]);
    expect(element.addClass).toHaveBeenCalledWith(triggerStyle[1]);
  });

  it('calls the function if passed', function() {
    var element = angular.element('<div></div>');
    var triggerFunction = jasmine.createSpy('triggerFunction');
    $transition(element, triggerFunction);
    $timeout.flush();
    expect(triggerFunction).toHaveBeenCalledWith(element);
  });

<<<<<<< HEAD
  it('calls the function and changes the css if passed a function and string', function() {
    var element = angular.element('<div></div>');
    var triggerFunction = jasmine.createSpy('triggerFunction');
    spyOn(element, 'addClass');
    var trigger = [triggerFunction, 'triggerClass'];
    $transition(element, trigger);
    $timeout.flush();
    expect(triggerFunction).toHaveBeenCalledWith(element);
    expect(element.addClass).toHaveBeenCalledWith('triggerClass');
  });

=======
  // transitionend emulation
  describe('emulateTransitionEnd', function() {
    it('should emit transition end-event after the specified duration', function() {
      var element = angular.element('<div></div>');
      var transitionEndHandler = jasmine.createSpy('transitionEndHandler');

      // There is no transition property, so transitionend could not be fired 
      // on its own.
      var promise = $transition(element, {height: '100px'});
      promise.then(transitionEndHandler);
      promise.emulateTransitionEnd(1);

      $timeout.flush();
      expect(transitionEndHandler).toHaveBeenCalledWith(element);
    });
  });
  
>>>>>>> origin/feat-transition-emu
  // Versions of Internet Explorer before version 10 do not have CSS transitions
  if ( !ie  || ie > 9 ) {
    describe('transitionEnd event', function() {
      var element, triggerTransitionEnd;

      beforeEach(function() {
        element = angular.element('<div></div>');
        // Mock up the element.bind method
        spyOn(element, 'bind').andCallFake(function(element, handler) {
          // Store the handler to be used to simulate the end of the transition later
          triggerTransitionEnd = handler;
        });
        // Mock up the element.unbind method
        spyOn(element, 'unbind');
      });

      describe('transitionEndEventName', function() {
        it('should be a string ending with transitionend', function() {
          expect($transition.transitionEndEventName).toMatch(/transitionend$/i);
        });
      });

      describe('animationEndEventName', function() {
        it('should be a string ending with animationend', function() {
          expect($transition.animationEndEventName).toMatch(/animationend$/i);
        });
      });

      it('binds a transitionEnd handler to the element', function() {
        $transition(element, '');
        expect(element.bind).toHaveBeenCalledWith($transition.transitionEndEventName, jasmine.any(Function));
      });

      it('binds an animationEnd handler to the element if option is given', function() {
        $transition(element, '', {animation: true});
        expect(element.bind).toHaveBeenCalledWith($transition.animationEndEventName, jasmine.any(Function));
      });

      it('resolves the promise when the transitionEnd is triggered', function() {
        var resolutionHandler = jasmine.createSpy('resolutionHandler');

        // Run the transition
        $transition(element, '').then(resolutionHandler);

        // Simulate the end of transition event
        triggerTransitionEnd();
        $timeout.flush();

        expect(resolutionHandler).toHaveBeenCalledWith(element);
      });

      it('rejects the promise if transition is cancelled', function() {
        var rejectionHandler = jasmine.createSpy('rejectionHandler');

        var promise = $transition(element, '');
        promise.then(null, rejectionHandler);

        promise.cancel();
        inject(function($rootScope) {
          $rootScope.$digest();
        });
        expect(rejectionHandler).toHaveBeenCalledWith(jasmine.any(String));
        expect(element.unbind).toHaveBeenCalledWith($transition.transitionEndEventName, jasmine.any(Function));
      });
    });
  } else {

    describe('transitionEndEventName', function() {
      it('should be undefined', function() {
        expect($transition.transitionEndEventName).not.toBeDefined();
      });
    });

    it('does not bind a transitionEnd handler to the element', function() {
      var element = angular.element('<div></div>');
      spyOn(element, 'bind');
      $transition(element, '');
      expect(element.bind).not.toHaveBeenCalledWith($transition.transitionEndEventName, jasmine.any(Function));
    });

    it('resolves the promise', function() {
      var element = angular.element('<div></div>');
      var transitionEndHandler = jasmine.createSpy('transitionEndHandler');
      $transition(element, '').then(transitionEndHandler);
      $timeout.flush();
      expect(transitionEndHandler).toHaveBeenCalledWith(element);
    });

  }
});

