import {Cron, CronConfig} from "../../source/cron";
import {assert, expect} from 'chai'

require('source-map-support').install()

describe('a working cron', function () {

  it('can dynamically modify the interval', async function () {
    const intervals: number[] = []
    let step = 0
    const cron = new Cron([{
      name: "",
      action: (config: CronConfig) => {
        console.log(step, config.interval)
        intervals.push(config.interval)
        if (step++ >= 5) {
          console.log('finished')
          return Promise.resolve({
            active: false
          })
        }

        return Promise.resolve({
          interval: config.interval + 5
        })
      }
    }], 10)

    cron.start()

    await new Promise(r => setTimeout(r, 1000))

    assert.equal(intervals.length, 6)
    assert.equal(intervals[0], 10)
    assert.equal(intervals[1], 15)
    assert.equal(intervals[2], 20)
    assert.equal(intervals[3], 25)
    assert.equal(intervals[4], 30)
    assert.equal(intervals[5], 35)
  })
})