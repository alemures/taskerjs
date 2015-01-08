var taskerjs = require('../index');

var acc = new taskerjs.Accumulator({
    tasksLimit: 80, // Limit of tasks to call to the worker
    timeLimit: 3000, // Elapsed time between calls to the worker in milliseconds
    maxTasksLimit: 800 // Max number of tasks by worker execution
});

acc.setWorker(function(tasks, cb) {
   console.log(tasks);
    cb();
});

process.stdin.resume();
process.stdin.on('data', function(data) {
    data = data.toString().trim();

    acc.add({data: 'Secret'});
});
