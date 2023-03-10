import { Delayer } from '../src/Delayer';

describe('Delayer', () => {
  describe('constructor', () => {
    it('should return a Delayer instance', () => {
      const delayer = new Delayer();
      expect(delayer).toBeInstanceOf(Delayer);
    });
  });

  describe('#add()', () => {
    it('should add a task', (done) => {
      const executedActions: string[] = [];

      function action(order: string) {
        return () => {
          executedActions.push(order);
        };
      }

      const delayer = new Delayer();
      delayer.add('#1', action('first'), 10);
      delayer.add('#2', action('second'), 10);
      delayer.add('#3', action('third'), 10);
      delayer.add('#3', action('fourth'), 5);

      setTimeout(() => {
        expect(executedActions).toEqual(['fourth', 'first', 'second']);
        done();
      }, 15);
    });
  });

  describe('#isDelayed()', () => {
    it('should check if a task is delayed', (done) => {
      const delayer = new Delayer();
      delayer.add('#1', done, 10);

      expect(delayer.isDelayed('#1')).toBe(true);
      expect(delayer.isDelayed('#2')).toBe(false);
    });
  });

  describe('#remove()', () => {
    it('should remove a task by id', () => {
      const delayer = new Delayer();
      delayer.add('#1', jest.fn(), 10);
      expect(delayer.isDelayed('#1')).toBe(true);
      delayer.remove('#1');
      expect(delayer.isDelayed('#1')).toBe(false);
    });

    it('should ignore unknown task ids', (done) => {
      const delayer = new Delayer();
      delayer.add('#1', done, 10);
      expect(delayer.isDelayed('#1')).toBe(true);
      delayer.remove('#2');
      expect(delayer.isDelayed('#1')).toBe(true);
    });
  });

  describe('#removeAll()', () => {
    it('should remove all tasks', () => {
      const delayer = new Delayer();
      delayer.add('#1', jest.fn(), 10);
      delayer.add('#2', jest.fn(), 10);
      expect(delayer.isDelayed('#1')).toBe(true);
      expect(delayer.isDelayed('#2')).toBe(true);
      delayer.removeAll();
      expect(delayer.isDelayed('#1')).toBe(false);
      expect(delayer.isDelayed('#2')).toBe(false);
    });
  });
});
