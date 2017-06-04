export declare type Action = () => Promise<any>;
export interface Task {
    name: string;
    action: Action;
}
export interface CronErrorLogger {
    logError(error: any): Promise<any> | void;
}
export declare class Cron {
    private tasks;
    private interval;
    private status;
    private errorLogger;
    constructor(tasks: Task[], interval?: number, errorLogger?: CronErrorLogger);
    private runTask(task);
    private update();
    start(): void;
    stop(): void;
}
