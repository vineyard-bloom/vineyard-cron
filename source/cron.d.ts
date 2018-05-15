export interface CronConfig {
    interval: number;
}
export interface CronConfigChange {
    interval?: number;
    active?: boolean;
}
export declare type OldAction = () => Promise<any> | void;
export declare type NewAction = (config: CronConfig) => Promise<CronConfigChange> | void;
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
    /**
     * Begins the Cron.
     */
    start(): void;
    /**
     * Upon failure, tests whether the Cron can perform a simple action.
     */
    onceNotWorking(action: SimpleAction): Promise<void>;
    /**
     * Restarts the Cron.
     */
    forceUpdate(): Promise<void>;
    /**
     * Stops the Cron.
     */
    stop(): Promise<void>;
}
