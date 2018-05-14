# Vineyard Cron

The Cron library provides functionality for long-running, repetitive Node.js services.

## Example Usage

    (placeholder code)
    const tasks = [ { 'A function', aFunction() }, { 'Another function', anotherFunction() } ]
    const cron = new Cron({tasks, 50000})
    cron.start()
    cron.forceUpdate()
    cron.stop()

## Cron `class`

#### Constructor

Parameters

*  tasks `Task[]` 
*  interval `number` (*default*=`30000`) 
*  errorLogger `CronErrorLogger` (*default*=` new DefaultErrorLogger()`) 

Returns `Cron`

#### Functions

##### `forceUpdate`
Restarts the Cron.

Returns `Promise`

##### `onceNotWorking`
Upon failure, tests whether the Cron can perform a simple action.

Parameters

*  action `SimpleAction` 

Returns `Promise`

##### `start`
Begins the Cron.

Returns `void`

##### `stop`
Stops the Cron.

Returns `Promise`

