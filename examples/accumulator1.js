'use strict';

var taskerjs = require('../index');

var acc = new taskerjs.Accumulator({
  tasksLimit: 500, // Limit of tasks to call to the worker
  timeLimit: 1000, // Elapsed time between calls to the worker in milliseconds
  maxTasksLimit: 800 // Max number of tasks by worker execution
});

acc.setWorker(function (tasks, cb) {
  console.log(tasks.length + ' tasks processed');
  cb();
});

for (var i = 0; i < 111100; i++) {
  acc.add(createQuery());
}

setInterval(function () {
  for (var i = 0; i < 2600; i++) {
    acc.add(createQuery());
  }
}, 3000);

function createQuery() {
  return 'select * from user where name like "A%" and age > 18 order by name limit 100;';
}
