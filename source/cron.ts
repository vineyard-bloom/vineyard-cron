enum Status {
    inactive,
    running,
    stopping,
}

export class Cron {
    private update: () => Promise<any>;
    private interval: number;
    private name: string;
    private status: Status = Status.inactive;

    constructor(update: () => Promise<any>, name: string, interval: number = 30000) {
        this.update = update;
        this.name = name;
        this.interval = interval
    }

    start() {
        if (this.status != Status.inactive)
            throw new Error(name + " is already running.");

        const loop = () => {
            if (this.status == Status.stopping)
                this.status = Status.inactive;

            if (this.status == Status.running)
                setTimeout(update, this.interval)
        };

        const update = () => {
            this.update()
                .then(loop)
                .catch(error => {
                    console.error("Error during cron '" + this.name + "'", error, error.stack);
                    loop()
                })
        };
        update();
        this.status = Status.running
    }

    stop() {
        this.status = Status.stopping
    }

}
