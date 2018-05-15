# Vineyard Cron

The Cron library provides functionality for long-running, repetitive Node.js services.

## Example Usage

    import {Cron} from 'vineyard-cron'

    const simpleCron = new Cron([
      {
        name: 'Example Action',
        action: () => exampleFunction()
      }
    ])
    simpleCron.start()

    const customCron = new Cron([
      {
        name: 'Example Action',
        action: () => exampleFunction()
      }
    ], 60000, customErrorLogger)
    customCron.start()

## Cron `class`

#### Constructor

Parameters

*  tasks `Task[]` 
*  interval `number` (*default*=`30000`) 
*  errorLogger `CronErrorLogger` (*default*=` new DefaultErrorLogger()`) 

Returns `Cron`

#### Functions

##### `start`
Begins the Cron.

Returns `void`

##### `stop`
Stops the Cron.

Returns `Promise`


## Task `interface`
A task is an object containing a name and an action.


#### Properties

* action `Action` 
* name `string` 
