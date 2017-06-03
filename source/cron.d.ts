export declare type Action = () => Promise<any>;
export interface Task {
    name: string;
    action: Action;
}
export declare class Cron {
    private tasks;
    private interval;
    private status;
    constructor(tasks: Task[], interval?: number);
    private runTask(task);
    private update();
    start(): void;
    stop(): void;
}
