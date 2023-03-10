import Debug from 'debug';

const debug = Debug('taskerjs:Delayer');

export class Delayer {
  private timeoutIds: Map<string, NodeJS.Timeout>;

  constructor() {
    this.timeoutIds = new Map();
  }

  add(taskId: string, cb: () => void, delay: number) {
    const timeoutId = this.timeoutIds.get(taskId);
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    this.timeoutIds.set(taskId, setTimeout(this.cbWrapper(taskId, cb), delay));

    debug('Added task with id: %s and delay: %d', taskId, delay);
  }

  isDelayed(taskId: string) {
    return this.timeoutIds.has(taskId);
  }

  remove(taskId: string) {
    const timeoutId = this.timeoutIds.get(taskId);
    if (timeoutId) {
      clearTimeout(timeoutId);
      this.timeoutIds.delete(taskId);

      debug('Removed task with id %s', taskId);
    }
  }

  removeAll() {
    this.timeoutIds.forEach((timeoutId, taskId) => {
      clearTimeout(timeoutId);
      this.timeoutIds.delete(taskId);
    });

    debug('Removed all tasks');
  }

  private cbWrapper(taskId: string, cb: () => void) {
    return () => {
      this.remove(taskId);
      cb();
    };
  }
}
