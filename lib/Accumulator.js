const debug = require('debug')('taskerjs:Accumulator');
const Denque = require('denque');

/**
 * @callback AccumulatorWorker
 * @param {any[]} tasks The tasks to be processed.
 * @param {function} done Function to call after all tasks have been processed.
 */

class Accumulator {
  /**
   * @param {object} config
   * @param {number} [config.tasksLimit]
   * @param {number} [config.timeLimit]
   * @param {number} [config.maxTasksLimit]
   */
  constructor(config = {}) {
    // Limit of tasks to call to the worker
    this._tasksLimit = config.tasksLimit !== undefined ? config.tasksLimit : 10;

    // Elapsed time between calls to the worker in milliseconds
    this._timeLimit = config.timeLimit !== undefined ? config.timeLimit : 3000;

    // Max number of tasks by worker execution
    this._maxTasksLimit =
      config.maxTasksLimit !== undefined ? config.maxTasksLimit : 25;

    this._tasks = new Denque();

    this._running = false;
    /**
     * @type {NodeJS.Timeout | null}
     */
    this._idTimeout = null;

    /**
     * @type {AccumulatorWorker | null}
     */
    this._worker = null;

    this.start();
  }

  /**
   * @param {any} task
   */
  add(task) {
    this._tasks.push(task);
    this._tryToProcess();
  }

  /**
   * @param {any[]} tasks
   */
  addAll(tasks) {
    for (let i = 0; i < tasks.length; i++) {
      this._tasks.push(tasks[i]);
    }

    this._tryToProcess();
  }

  size() {
    return this._tasks.length;
  }

  /**
   * @param {number} fromIndex
   * @param {number} nItems
   * @returns {any[]}
   */
  removeRange(fromIndex, nItems) {
    const removed = this._tasks.splice(fromIndex, nItems);
    return removed === undefined ? [] : removed;
  }

  removeAll() {
    return this._tasks.clear();
  }

  start() {
    if (!this._running) {
      this._running = true;
      this._loop();
    }
  }

  stop() {
    if (this._running) {
      if (this._idTimeout) {
        clearTimeout(this._idTimeout);
      }

      this._idTimeout = null;
      this._running = false;
    }
  }

  isRunning() {
    return this._running;
  }

  restart() {
    this.stop();
    this.start();
  }

  /**
   * @param {AccumulatorWorker} worker
   */
  setWorker(worker) {
    this._worker = worker;
  }

  toString() {
    return `[${this._tasks.toArray().toString()}]`;
  }

  _tryToProcess() {
    if (this._running && this._tasks.length >= this._tasksLimit) {
      this._process(() => this.restart());
    }
  }

  _loop() {
    this._idTimeout = setTimeout(
      () => this._process(this._loopCallback()),
      this._timeLimit
    );
  }

  _loopCallback() {
    return () => {
      this._loop();
    };
  }

  /**
   * @param {function} done
   */
  _process(done) {
    if (this._tasks.length > 0 && this._worker) {
      debug('Processing %d tasks', this._tasks.length);
      const tasks = this.removeRange(0, this._maxTasksLimit);
      this._worker(tasks, done);
    } else {
      debug('No tasks or worker to process, waiting...');
      done();
    }
  }
}

module.exports = Accumulator;
