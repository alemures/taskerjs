const Accumulator = require('../lib/Accumulator');

const acc = new Accumulator({
  tasksLimit: 80, // Limit of tasks to call to the worker
  timeLimit: 3000, // Elapsed time between calls to the worker in milliseconds
  maxTasksLimit: 800, // Max number of tasks by worker execution
});

acc.setWorker((tasks, done) => {
  console.log(tasks);
  done();
});

process.stdin.resume();
process.stdin.on('data', () => {
  acc.add({ data: 'Secret' });
});

console.log('Press enter to add one task');
