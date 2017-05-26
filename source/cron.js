"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Status;
(function (Status) {
    Status[Status["inactive"] = 0] = "inactive";
    Status[Status["running"] = 1] = "running";
    Status[Status["stopping"] = 2] = "stopping";
})(Status || (Status = {}));
var Cron = (function () {
    function Cron(update, name, interval) {
        if (interval === void 0) { interval = 30000; }
        this.status = Status.inactive;
        this.update = update;
        this.name = name;
        this.interval = interval;
    }
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
                console.error("Error during cron '" + _this.name + "'", error, error.stack);
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