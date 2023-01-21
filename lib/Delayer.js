const debug = require('debug')('taskerjs:Delayer');

class Delayer {
  constructor() {
    /**
     * @type {Object.<string, NodeJS.Timeout>}
     */
    this._timeoutIds = {};
  }

  /**
   * @param {string} taskId
   * @param {Function} cb
   * @param {number} delay
   */
  add(taskId, cb, delay) {
    const timeoutId = this._timeoutIds[taskId];
    if (timeoutId !== undefined) {
      clearTimeout(timeoutId);
    }

    this._timeoutIds[taskId] = setTimeout(this._cbWrapper(taskId, cb), delay);

    debug('Added task with id: %s and delay: %d', taskId, delay);
  }

  /**
   * @param {string} taskId
   * @returns {boolean}
   */
  isDelayed(taskId) {
    return this._timeoutIds[taskId] !== undefined;
  }

  /**
   * @param {string} taskId
   */
  remove(taskId) {
    const timeoutId = this._timeoutIds[taskId];
    if (timeoutId !== undefined) {
      clearTimeout(timeoutId);
      delete this._timeoutIds[taskId];

      debug('Removed task with id %s', taskId);
    }
  }

  removeAll() {
    Object.keys(this._timeoutIds).forEach((taskId) => {
      clearTimeout(this._timeoutIds[taskId]);
      delete this._timeoutIds[taskId];
    });

    debug('Removed all tasks');
  }

  /**
   * @param {string} taskId
   * @param {Function} cb
   */
  _cbWrapper(taskId, cb) {
    return () => {
      this.remove(taskId);
      cb();
    };
  }
}

module.exports = Delayer;
