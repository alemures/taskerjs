'use strict';

var taskerjs = require('../index');

var delayer = new taskerjs.Delayer();

delayer.add('#1', action('first'), 2000);
delayer.add('#2', action('second'), 2000);
delayer.add('#3', action('third'), 2000);

// It will override action('first') that never will be called
delayer.add('#1', action('fourth'), 3000);

function action(order) {
  return function () {
    console.log('Executing ' + order + 'action');
  };
}
