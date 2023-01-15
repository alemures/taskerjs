const { expect } = require('chai');
const Delayer = require('../lib/Delayer');

describe('Delayer', () => {
  describe('constructor', () => {
    it('should return a Delayer instance', () => {
      const delayer = new Delayer();
      expect(delayer).to.be.an.instanceof(Delayer);
    });
  });

  describe('#add()', () => {
    it('should add a task', (done) => {
      /**
       * @type {string[]}
       */
      const executedActions = [];

      /**
       * @param {string} order
       */
      function action(order) {
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
        expect(executedActions).to.be.deep.equal(['fourth', 'first', 'second']);
        done();
      }, 15);
    });
  });

  describe('#isDelayed()', () => {
    it('should check if a task is delayed', (done) => {
      const delayer = new Delayer();
      delayer.add('#1', done, 10);

      expect(delayer.isDelayed('#1')).to.be.equal(true);
      expect(delayer.isDelayed('#2')).to.be.equal(false);
    });
  });

  describe('#remove()', () => {
    it('should remove a task by id', () => {
      const delayer = new Delayer();
      delayer.add('#1', () => {}, 10);
      expect(delayer.isDelayed('#1')).to.be.equal(true);
      delayer.remove('#1');
      expect(delayer.isDelayed('#1')).to.be.equal(false);
    });

    it('should ignore unknown task ids', (done) => {
      const delayer = new Delayer();
      delayer.add('#1', done, 10);
      expect(delayer.isDelayed('#1')).to.be.equal(true);
      delayer.remove('#2');
      expect(delayer.isDelayed('#1')).to.be.equal(true);
    });
  });

  describe('#removeAll()', () => {
    it('should remove all tasks', () => {
      const delayer = new Delayer();
      delayer.add('#1', () => {}, 10);
      delayer.add('#2', () => {}, 10);
      expect(delayer.isDelayed('#1')).to.be.equal(true);
      expect(delayer.isDelayed('#2')).to.be.equal(true);
      delayer.removeAll();
      expect(delayer.isDelayed('#1')).to.be.equal(false);
      expect(delayer.isDelayed('#2')).to.be.equal(false);
    });
  });
});
