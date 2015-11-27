taskerjs
===
This module contains features to process tasks.

### Installation
`npm install taskerjs`

### Accumulator
This class allows to process tasks in bulk. 

```
var taskerjs = require('taskerjs');

var acc = new taskerjs.Accumulator({
    tasksLimit: 50, // Limit of tasks to call to the worker
    timeLimit: 1000, // Elapsed time between calls to the worker in milliseconds
    maxTasksLimit: 80 // Max number of tasks by worker execution
});

acc.setWorker(function(tasks, cb) {
    console.log(tasks.length + ' tasks processed');
    cb();
});

acc.add('Tasks number 1');
acc.add(1);
acc.add({data: 1});
```

### Delayer
This class allows set timeouts with ids so they can be overridden and reset easily.

```
var taskerjs = require('taskerjs');

var delayer = new taskerjs.Delayer();

delayer.add('#1', action('first'), 2000);
delayer.add('#2', action('second'), 2000);
delayer.add('#3', action('third'), 2000);

// It Will override action('first') that never will be called
delayer.add('#1', action('fourth'), 3000);

function action(order) {
  return function() {
    console.log('Executing ' + order + 'action');
  };
}
```