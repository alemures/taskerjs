import Debug from 'debug';
import Denque from 'denque';

const debug = Debug('taskerjs:Accumulator');

export type AccumulatorWorker = (tasks: unknown[], done: () => void) => void;

export interface AccumulatorOptions {
  tasksLimit?: number;
  timeLimit?: number;
  maxTasksLimit?: number;
}

export class Accumulator {
  private tasksLimit: number;
  private timeLimit: number;
  private maxTasksLimit: number;
  private tasks: Denque<unknown>;
  private running: boolean;
  private idTimeout?: NodeJS.Timeout;
  private worker?: AccumulatorWorker;

  constructor(options: AccumulatorOptions = {}) {
    // Limit of tasks to call to the worker
    this.tasksLimit =
      options.tasksLimit !== undefined ? options.tasksLimit : 10;

    // Elapsed time between calls to the worker in milliseconds
    this.timeLimit = options.timeLimit !== undefined ? options.timeLimit : 3000;

    // Max number of tasks by worker execution
    this.maxTasksLimit =
      options.maxTasksLimit !== undefined ? options.maxTasksLimit : 25;

    this.tasks = new Denque();
    this.running = false;

    this.start();
  }

  add(task: unknown) {
    this.tasks.push(task);
    this.tryToProcess();
  }

  addAll(tasks: unknown[]) {
    for (const task of tasks) {
      this.tasks.push(task);
    }

    this.tryToProcess();
  }

  size() {
    return this.tasks.length;
  }

  removeRange(fromIndex: number, nItems: number) {
    const removed = this.tasks.splice(fromIndex, nItems);
    return removed ? removed : [];
  }

  removeAll() {
    return this.tasks.clear();
  }

  start() {
    if (!this.running) {
      this.running = true;
      this.loop();
    }
  }

  stop() {
    if (this.running) {
      if (this.idTimeout) {
        clearTimeout(this.idTimeout);
      }

      this.idTimeout = undefined;
      this.running = false;
    }
  }

  isRunning() {
    return this.running;
  }

  restart() {
    this.stop();
    this.start();
  }

  setWorker(worker: AccumulatorWorker) {
    this.worker = worker;
  }

  toString() {
    return `[${this.tasks.toArray().toString()}]`;
  }

  private tryToProcess() {
    if (this.running && this.tasks.length >= this.tasksLimit) {
      this.process(() => this.restart());
    }
  }

  private loop() {
    this.idTimeout = setTimeout(
      () => this.process(this.loopCallback()),
      this.timeLimit
    );
  }

  private loopCallback() {
    return () => {
      this.loop();
    };
  }

  private process(done: () => void) {
    if (this.tasks.length > 0 && this.worker) {
      debug('Processing %d tasks', this.tasks.length);
      const tasks = this.removeRange(0, this.maxTasksLimit);
      this.worker(tasks, done);
    } else {
      debug('No tasks or worker to process, waiting...');
      done();
    }
  }
}
