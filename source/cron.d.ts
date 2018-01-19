export interface CronConfigOutput {
    interval: number;
}
export interface CronConfigInput {
    interval?: number;
    active?: boolean;
}
export declare type OldAction = () => Promise<any> | void;
export declare type NewAction = (config: CronConfigOutput) => Promise<CronConfigInput> | void;
export declare type Action = NewAction | OldAction;
export declare type SimpleAction = () => Promise<any> | void;
export interface Task {
    name: string;
    action: Action;
}
export interface CronErrorLogger {
    logError(error: Error): Promise<any> | void;
}
export declare class Cron {
    private tasks;
    private interval;
    private status;
    private errorLogger;
    private isWorking;
    constructor(tasks: Task[], interval?: number, errorLogger?: CronErrorLogger);
    private runTask(task);
    private update();
    start(): void;
    onceNotWorking(action: SimpleAction): Promise<void>;
    forceUpdate(): Promise<void>;
    stop(): Promise<void>;
}
