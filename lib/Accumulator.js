'use strict';

var List = require('collections/list');

function Accumulator(config) {
  if (typeof config !== 'object') {
    config = {};
  }

  // Limit of tasks to call to the worker
  this._tasksLimit = config.tasksLimit !== undefined ?
      config.tasksLimit : 10;

  // Elapsed time between calls to the worker in milliseconds
  this._timeLimit = config.timeLimit !== undefined ?
      config.timeLimit : 3000;

  // Max number of tasks by worker execution
  this._maxTasksLimit = config.maxTasksLimit !== undefined ?
          config.maxTasksLimit : 25;

  this._tasks = new List();

  this._running = false;
  this._idTimeout = null;

  this._worker = this._defaultWorker;

  this.start();
}

Accumulator.prototype.add = function(task) {
  this._tasks.push(task);

  this._tryToProcess();
};

Accumulator.prototype.addAll = function(tasks) {
  var length = tasks.length;
  var i;

  for (i = 0; i < length; i++) {
    this._tasks.push(tasks[i]);
  }

  this._tryToProcess();
};

Accumulator.prototype.size = function() {
  return this._tasks.length;
};

Accumulator.prototype.removeRange = function(fromIndex, nItems) {
  return this._tasks.splice(fromIndex, nItems);
};

Accumulator.prototype.removeAll = function() {
  return this._tasks.clear();
};

Accumulator.prototype.start = function() {
  if (!this._running) {
    this._running = true;
    this._loop();
  }
};

Accumulator.prototype.stop = function() {
  if (this._running) {
    clearTimeout(this._idTimeout);
    this._idTimeout = null;
    this._running = false;
  }
};

Accumulator.prototype.restart = function() {
  this.stop();
  this.start();
};

Accumulator.prototype.setWorker = function(worker) {
  this._worker = worker;
};

Accumulator.prototype.toString = function() {
  return '[' + this._tasks.toArray().toString() + ']';
};

Accumulator.prototype._tryToProcess = function() {
  if (this._running && this._tasks.length >= this._tasksLimit) {
    var _this = this;
    this._process(this, function() {
      _this.restart();
    });
  }
};

Accumulator.prototype._loop = function() {
  this._idTimeout = setTimeout(this._process, this._timeLimit, this, this._loopCallback());
};

Accumulator.prototype._loopCallback = function() {
  var _this = this;
  return function() {
    _this._loop();
  };
};

Accumulator.prototype._process = function(_this, cb) {
  if (_this._tasks.length > 0) {
    var tasks = _this.removeRange(0, _this._maxTasksLimit);
    _this._worker(tasks, cb);
  } else {
    cb();
  }
};

Accumulator.prototype._defaultWorker = function(tasks, cb) {
  console.log(tasks.length + ' tasks processed.');
  cb();
};

module.exports = Accumulator;
