"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var promise_each2_1 = require("promise-each2");
var Status;
(function (Status) {
    Status[Status["inactive"] = 0] = "inactive";
    Status[Status["running"] = 1] = "running";
    Status[Status["stopping"] = 2] = "stopping";
})(Status || (Status = {}));
var DefaultErrorLogger = /** @class */ (function () {
    function DefaultErrorLogger() {
    }
    DefaultErrorLogger.prototype.logError = function (error) {
        console.error(error.stack || error.message);
    };
    return DefaultErrorLogger;
}());
var Cron = /** @class */ (function () {
    function Cron(tasks, interval, errorLogger) {
        if (interval === void 0) { interval = 30000; }
        if (errorLogger === void 0) { errorLogger = new DefaultErrorLogger(); }
        this.status = Status.inactive;
        this.isWorking = false;
        this.tasks = tasks;
        this.interval = interval;
        this.errorLogger = errorLogger;
    }
    Cron.prototype.runTask = function (task) {
        var _this = this;
        return Promise.resolve().then(function () { return task.action({ interval: _this.interval }); })
            .then(function (adjustment) {
            if (adjustment && typeof adjustment === 'object') {
                if (typeof adjustment.interval === 'number') {
                    _this.interval = adjustment.interval;
                }
                if (typeof adjustment.active === 'boolean') {
                    _this.status = Status.inactive;
                }
            }
        })
            .catch(function (error) {
            if (typeof error === 'string')
                error = new Error(error);
            else if (!error || typeof error !== 'object')
                error = new Error();
            error.message = "Error during task '" + task.name + "': " + error.message;
            _this.errorLogger.logError(error);
        });
    };
    Cron.prototype.update = function () {
        var _this = this;
        this.isWorking = true;
        return promise_each2_1.each(this.tasks, function (task) { return _this.runTask(task); })
            .then(function () { return _this.isWorking = false; });
    };
    /**
     * Begins the Cron.
     */
    Cron.prototype.start = function () {
        var _this = this;
        if (this.status != Status.inactive)
            throw new Error("Cron is already running.");
        var loop = function () {
            if (_this.status == Status.stopping)
                _this.status = Status.inactive;
            if (_this.status == Status.running)
                setTimeout(update, _this.interval);
        };
        var update = function () {
            _this.update()
                .then(loop)
                .catch(function (error) {
                _this.errorLogger.logError(error);
                loop();
            });
        };
        update();
        this.status = Status.running;
    };
    /**
     * Upon failure, tests whether the Cron can perform a simple action.
     */
    Cron.prototype.onceNotWorking = function (action) {
        var _this = this;
        if (!this.isWorking) {
            var result = action();
            return result && typeof result.then === 'function'
                ? result
                : Promise.resolve();
        }
        return new Promise(function (resolve, reject) {
            var poll = function () {
                if (!_this.isWorking) {
                    resolve(action());
                }
                else {
                    setTimeout(poll, 50);
                }
            };
            poll();
        });
    };
    /**
     * Restarts the Cron.
     */
    Cron.prototype.forceUpdate = function () {
        var _this = this;
        return this.onceNotWorking(function () { return _this.update(); });
    };
    /**
     * Stops the Cron.
     */
    Cron.prototype.stop = function () {
        var _this = this;
        return this.onceNotWorking(function () {
            _this.status = Status.inactive;
        });
    };
    return Cron;
}());
exports.Cron = Cron;
//# sourceMappingURL=cron.js.map