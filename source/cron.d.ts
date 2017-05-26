export declare class Cron {
    private update;
    private interval;
    private name;
    private status;
    constructor(update: () => Promise<any>, name: string, interval?: number);
    start(): void;
    stop(): void;
}
