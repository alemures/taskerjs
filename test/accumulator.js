const { expect } = require('chai');
const Accumulator = require('../lib/Accumulator');

describe('Accumulator', () => {
  describe('constructor', () => {
    it('should return a Accumulator instance', () => {
      const acc = new Accumulator();
      expect(acc).to.be.an.instanceof(Accumulator);
      acc.stop();
    });
    it('should return a Accumulator instance with custom config', () => {
      const acc = new Accumulator({
        tasksLimit: 500,
        timeLimit: 1000,
        maxTasksLimit: 800,
      });
      expect(acc).to.be.an.instanceof(Accumulator);
      acc.stop();
    });
    it('should return a started Accumulator instance', () => {
      const acc = new Accumulator();
      expect(acc.isRunning()).to.be.equal(true);
      acc.stop();
    });
  });

  describe('#add()', () => {
    it('should add a task', () => {
      const acc = new Accumulator();
      acc.add(1);
      acc.add(2);
      acc.add(3);
      expect(acc.size()).to.equal(3);
      acc.stop();
    });
  });

  describe('#addAll()', () => {
    it('should add a list of tasks', () => {
      const acc = new Accumulator();
      acc.addAll([1, 2, 3]);
      expect(acc.size()).to.equal(3);
      acc.stop();
    });
  });

  describe('#size()', () => {
    it('should return the current number of tasks', () => {
      const acc = new Accumulator();
      acc.addAll([1, 2, 3]);
      expect(acc.size()).to.equal(3);
      acc.stop();
    });
  });

  describe('#removeRange()', () => {
    it('should remove a range of tasks', () => {
      const acc = new Accumulator();
      acc.addAll([1, 2, 3]);
      expect(acc.removeRange(1, 1)).to.deep.equal([2]);
      acc.stop();
    });
  });

  describe('#removeAll()', () => {
    it('should remove all of tasks', () => {
      const acc = new Accumulator();
      acc.addAll([1, 2, 3]);
      expect(acc.size()).to.equal(3);
      acc.removeAll();
      expect(acc.size()).to.equal(0);
      acc.stop();
    });
  });

  describe('#start()', () => {
    it('should start executing tasks', () => {
      const acc = new Accumulator();
      acc.stop();
      expect(acc.isRunning()).to.equal(false);
      acc.start();
      expect(acc.isRunning()).to.equal(true);
      acc.stop();
    });

    it('should ignore multiple calls', () => {
      const acc = new Accumulator();
      acc.stop();
      expect(acc.isRunning()).to.equal(false);
      acc.start();
      acc.start();
      expect(acc.isRunning()).to.equal(true);
      acc.stop();
    });
  });

  describe('#stop()', () => {
    it('should stop executing tasks', () => {
      const acc = new Accumulator();
      expect(acc.isRunning()).to.equal(true);
      acc.stop();
      expect(acc.isRunning()).to.equal(false);
    });

    it('should ignore multiple calls', () => {
      const acc = new Accumulator();
      expect(acc.isRunning()).to.equal(true);
      acc.stop();
      acc.stop();
      expect(acc.isRunning()).to.equal(false);
    });
  });

  describe('#restart()', () => {
    it('should stop and start executing tasks', () => {
      const acc = new Accumulator();
      expect(acc.isRunning()).to.equal(true);
      acc.restart();
      expect(acc.isRunning()).to.equal(true);
      acc.stop();
    });
  });

  describe('#setWorker()', () => {
    it('should set a worker and start executing tasks', (done) => {
      const acc = new Accumulator({
        timeLimit: 5,
      });
      acc.setWorker((tasks, cb) => {
        expect(tasks).to.be.deep.equal([1, 2, 3]);
        cb();

        acc.stop();
        done();
      });
      acc.addAll([1, 2, 3]);
    });

    it('should set a worker and start executing tasks with maxTasksLimit set to 2', (done) => {
      const acc = new Accumulator({
        timeLimit: 5,
        maxTasksLimit: 2,
      });
      let processedTasks = 0;
      acc.setWorker((tasks, cb) => {
        expect(tasks.length).to.be.equal(2);
        processedTasks += 2;
        cb();

        if (processedTasks === 4) {
          acc.stop();
          done();
        }
      });
      acc.addAll([1, 2, 3, 4]);
    });

    it('should set a worker and start executing tasks with tasksLimit set to 2', (done) => {
      const acc = new Accumulator({
        timeLimit: 5,
        tasksLimit: 2,
      });
      let processedTasks = 0;
      acc.setWorker((tasks, cb) => {
        expect(tasks.length).to.be.equal(2);
        processedTasks += 2;
        cb();

        if (processedTasks === 4) {
          acc.stop();
          done();
        }
      });
      acc.add(1);
      acc.add(2);
      acc.add(3);
      acc.add(4);
    });
  });

  describe('#toString()', () => {
    it('should return a string representation of the instance', () => {
      const acc = new Accumulator();
      expect(acc.toString()).to.equal('[]');
      acc.stop();
    });
  });
});
