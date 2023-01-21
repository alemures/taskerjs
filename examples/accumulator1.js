const Accumulator = require('../lib/Accumulator');

function createQuery() {
  return 'select * from user where name like "A%" and age > 18 order by name limit 100;';
}

const acc = new Accumulator({
  tasksLimit: 500, // Limit of tasks to call to the worker
  timeLimit: 1000, // Elapsed time between calls to the worker in milliseconds
  maxTasksLimit: 800, // Max number of tasks by worker execution
});

acc.setWorker((tasks, done) => {
  console.log(`${tasks.length} tasks processed`);
  done();
});

for (let i = 0; i < 111100; i++) {
  acc.add(createQuery());
}

setInterval(() => {
  for (let i = 0; i < 2600; i++) {
    acc.add(createQuery());
  }
}, 3000);
