"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var promise_each2_1 = require("promise-each2");
var Status;
(function (Status) {
    Status[Status["inactive"] = 0] = "inactive";
    Status[Status["running"] = 1] = "running";
    Status[Status["stopping"] = 2] = "stopping";
})(Status || (Status = {}));
var Cron = (function () {
    function Cron(tasks, interval) {
        if (interval === void 0) { interval = 30000; }
        this.status = Status.inactive;
        this.tasks = tasks;
        this.interval = interval;
    }
    Cron.prototype.runTask = function (task) {
        return task.action()
            .catch(function (error) {
            console.error("Error during task '" + task.name + "'", error, error.stack);
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
                console.error("Error during cron.", error, error.stack);
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