'use strict';

var debug = require('debug')('taskerjs:Delayer');

function Delayer() {
  this._timeoutIds = {};
}

Delayer.prototype.add = function (taskId, cb, delay) {
  var timeoutId = this._timeoutIds[taskId];
  if (timeoutId !== undefined) {
    clearTimeout(timeoutId);
  }

  this._timeoutIds[taskId] = setTimeout(this._cbWrapper(taskId, cb), delay);

  debug('Added task with id: %s and delay: %d', taskId, delay);
};

Delayer.prototype.isDelayed = function (taskId) {
  return this._timeoutIds[taskId] !== undefined;
};

Delayer.prototype.remove = function (taskId) {
  var timeoutId = this._timeoutIds[taskId];
  if (timeoutId !== undefined) {
    clearTimeout(timeoutId);
    delete this._timeoutIds[taskId];

    debug('Removed task with id %s', taskId);
  }
};

Delayer.prototype.removeAll = function () {
  for (var taskId in this._timeoutIds) {
    clearTimeout(this._timeoutIds[taskId]);
    delete this._timeoutIds[taskId];
  }

  debug('Removed all tasks');
};

Delayer.prototype._cbWrapper = function (taskId, cb) {
  var _this = this;
  return function () {
    _this.remove(taskId);
    cb();
  };
};

module.exports = Delayer;
