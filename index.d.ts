declare module "lib/Accumulator" {
    export = Accumulator;
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
        constructor(config?: {
            tasksLimit?: number;
            timeLimit?: number;
            maxTasksLimit?: number;
        });
        _tasksLimit: number;
        _timeLimit: number;
        _maxTasksLimit: number;
        _tasks: Denque<any>;
        _running: boolean;
        /**
         * @type {NodeJS.Timeout | null}
         */
        _idTimeout: NodeJS.Timeout | null;
        /**
         * @type {AccumulatorWorker | null}
         */
        _worker: AccumulatorWorker | null;
        /**
         * @param {any} task
         */
        add(task: any): void;
        /**
         * @param {any[]} tasks
         */
        addAll(tasks: any[]): void;
        size(): number;
        /**
         * @param {number} fromIndex
         * @param {number} nItems
         * @returns {any[]}
         */
        removeRange(fromIndex: number, nItems: number): any[];
        removeAll(): void;
        start(): void;
        stop(): void;
        isRunning(): boolean;
        restart(): void;
        /**
         * @param {AccumulatorWorker} worker
         */
        setWorker(worker: AccumulatorWorker): void;
        toString(): string;
        _tryToProcess(): void;
        _loop(): void;
        _loopCallback(): () => void;
        /**
         * @param {function} done
         */
        _process(done: Function): void;
    }
    namespace Accumulator {
        export { AccumulatorWorker };
    }
    import Denque = require("denque");
    type AccumulatorWorker = (tasks: any[], done: Function) => any;
}
declare module "lib/Delayer" {
    export = Delayer;
    class Delayer {
        /**
         * @type {Object.<string, NodeJS.Timeout>}
         */
        _timeoutIds: {
            [x: string]: NodeJS.Timeout;
        };
        /**
         * @param {string} taskId
         * @param {Function} cb
         * @param {number} delay
         */
        add(taskId: string, cb: Function, delay: number): void;
        /**
         * @param {string} taskId
         * @returns {boolean}
         */
        isDelayed(taskId: string): boolean;
        /**
         * @param {string} taskId
         */
        remove(taskId: string): void;
        removeAll(): void;
        /**
         * @param {string} taskId
         * @param {Function} cb
         */
        _cbWrapper(taskId: string, cb: Function): () => void;
    }
}
declare module "taskerjs" {
    export const Accumulator: typeof import("lib/Accumulator");
    export const Delayer: typeof import("lib/Delayer");
}
