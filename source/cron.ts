import {each as promiseEach} from 'promise-each2'

enum Status {
  inactive,
  running,
  stopping,
}

export type Action = () => Promise<any>

export interface Task {
  name: string
  action: Action
}

export interface CronErrorLogger {
  logError(error): Promise<any> | void
}

class DefaultErrorLogger implements CronErrorLogger {
  logError(error) {
    console.error(error.stack || error.message)
  }
}

export class Cron {
  private tasks: Task[]
  private interval: number
  private status: Status = Status.inactive
  private errorLogger: CronErrorLogger
  private isWorking: boolean = false

  constructor(tasks: Task[], interval: number = 30000, errorLogger: CronErrorLogger = new DefaultErrorLogger()) {
    this.tasks = tasks;
    this.interval = interval
    this.errorLogger = errorLogger
  }

  private runTask(task: Task) {
    return task.action()
      .catch(error => {
        error.message = "Error during task '" + task.name + "': " + error.message
        this.errorLogger.logError(error)
      })
  }

  private update(): Promise<any> {
    this.isWorking = true
    return promiseEach(this.tasks, task => this.runTask(task))
      .then(() => this.isWorking = false)
  }

  start() {
    if (this.status != Status.inactive)
      throw new Error(name + " is already running.");

    const loop = () => {
      if (this.status == Status.stopping)
        this.status = Status.inactive;

      if (this.status == Status.running)
        setTimeout(update, this.interval)
    }

    const update = () => {
      this.update()
        .then(loop)
        .catch(error => {
          this.errorLogger.logError(error)
          loop()
        })
    }
    update()
    this.status = Status.running
  }

  onceNotWorking(action): Promise<void> {
    if (!this.isWorking) {
      const result = action()
      return result && typeof result.then === 'function'
        ? result
        : Promise.resolve()
    }

    return new Promise<void>((resolve, reject) => {
      const poll = () => {
        if (!this.isWorking) {
          resolve(action())
        }
        else {
          setTimeout(poll, 50)
        }
      }

      poll()
    })
  }

  forceUpdate(): Promise<void> {
    return this.onceNotWorking(() => this.update())
  }

  stop(): Promise<void> {
    return this.onceNotWorking(() => this.status = Status.inactive)
  }

}
