const { Delayer } = require('../dist/Delayer');

/**
 * @param {string} order
 */
function action(order) {
  return () => {
    console.log(`Executing ${order} action`);
  };
}

const delayer = new Delayer();

delayer.add('#1', action('first'), 2000);
delayer.add('#2', action('second'), 2000);
delayer.add('#3', action('third'), 2000);

// It will override action('first') that never will be called
delayer.add('#1', action('fourth'), 3000);
