taskerjs
===
This module contain any features to process tasks.

Accumulator
---

This class allow to you process tasks in bulk.

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