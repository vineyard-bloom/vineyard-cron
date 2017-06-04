"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var promise_each2_1 = require("promise-each2");
var Status;
(function (Status) {
    Status[Status["inactive"] = 0] = "inactive";
    Status[Status["running"] = 1] = "running";
    Status[Status["stopping"] = 2] = "stopping";
})(Status || (Status = {}));
var DefaultErrorLogger = (function () {
    function DefaultErrorLogger() {
    }
    DefaultErrorLogger.prototype.logError = function (error) {
        console.error(error.stack || error.message);
    };
    return DefaultErrorLogger;
}());
var Cron = (function () {
    function Cron(tasks, interval, errorLogger) {
        if (interval === void 0) { interval = 30000; }
        if (errorLogger === void 0) { errorLogger = new DefaultErrorLogger(); }
        this.status = Status.inactive;
        this.tasks = tasks;
        this.interval = interval;
        this.errorLogger = errorLogger;
    }
    Cron.prototype.runTask = function (task) {
        var _this = this;
        return task.action()
            .catch(function (error) {
            error.message = "Error during task '" + task.name + "': " + error.message;
            _this.errorLogger.logError(error);
        });
    };
    Cron.prototype.update = function () {
        var _this = this;
        return promise_each2_1.each(this.tasks, function (task) { return _this.runTask(task); });
    };
    Cron.prototype.start = function () {
        var _this = this;
        if (this.status != Status.inactive)
            throw new Error(name + " is already running.");
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
    Cron.prototype.stop = function () {
        this.status = Status.stopping;
    };
    return Cron;
}());
exports.Cron = Cron;
//# sourceMappingURL=cron.js.map