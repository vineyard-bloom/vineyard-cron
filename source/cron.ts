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

export class Cron {
  private tasks: Task[]
  private interval: number
  private status: Status = Status.inactive

  constructor(tasks: Task[], interval: number = 30000) {
    this.tasks = tasks;
    this.interval = interval
  }

  private runTask(task: Task) {
    return task.action()
      .catch(error => {
        console.error("Error during task '" + task.name + "'", error, error.stack);
      })
  }

  private update(): Promise<any> {
    return promiseEach(this.tasks, task => this.runTask(task))
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
          console.error("Error during cron.", error, error.stack);
          loop()
        })
    }
    update()
    this.status = Status.running
  }

  stop() {
    this.status = Status.stopping
  }

}
