var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors({
    origin: 'http://localhost:3000'
    // it is set this way to be compatible with the ShowStopper React project
}));
var timeSlice = /** @class */ (function () {
    function timeSlice(timeStamp, status, error) {
        this.timeStamp = timeStamp;
        this.status = status;
        this.error = error;
    }
    timeSlice.prototype.getTimeSliceObject = function () {
        return {
            timeStamp: this.timeStamp,
            status: this.status,
            error: this.error
        };
    };
    return timeSlice;
}());
function getTime() {
    return new Date();
}
function add1hr(time) {
    return new Date(time.getTime() + 60 * 60 * 1000);
}
function add6hr(time) {
    return new Date(time.getTime() + 6 * 60 * 60 * 1000);
}
function add1day(time) {
    return new Date(time.getTime() + 24 * 60 * 60 * 1000);
}
function chooseRandomStatus() {
    var list = ["running", "failed", "maintenance"];
    var randomIndex = Math.floor(Math.random() * list.length);
    return list[randomIndex];
}
function chooseRandomError() {
    var list = ["db write error", "UwU error", "Where TF is the DATABASE?", "I'm sorry Dave, I'm afraid I can't do that", "DB is not pookie"];
    var randomIndex = Math.floor(Math.random() * list.length);
    return list[randomIndex];
}
function generateJSON(length, timeDiffer) {
    var timeSlices = [];
    var time = getTime();
    for (var i = 0; i < length; i++) {
        var error = void 0;
        var status_1 = chooseRandomStatus();
        if (status_1 === "running") {
            error = "N/A";
        }
        else if (status_1 === "failed") {
            error = chooseRandomError();
        }
        else {
            error = "N/A";
        }
        var timeSliceObj = new timeSlice(time.toISOString(), status_1, error);
        timeSlices.push(timeSliceObj.getTimeSliceObject());
        if (timeDiffer === "day") {
            time = add1hr(time);
        }
        else if (timeDiffer === "week") {
            time = add6hr(time);
        }
        else if (timeDiffer === "month") {
            time = add1day(time);
        }
    }
    return timeSlices;
}
app.get('/', function (req, res) {
    res.redirect('/monitor/db-status/24hr');
});
app.get('/monitor/db-status/', function (req, res) {
    var frame = req.query.frame;
    if (frame === "24H") {
        res.send({
            "T": "24H",
            "data": generateJSON(24, "day")
        });
    }
    else if (frame === "1WK") {
        res.send({
            "T": "1WK",
            "data": generateJSON(28, "week")
        });
    }
    else if (frame === "1MO") {
        res.send({
            "T": "1MO",
            "data": generateJSON(30, "month")
        });
    }
    else if (frame === "DEATHWISH") {
        res.send({
            "T": "DEATHWISH",
            "data": generateJSON(5000, "day")
        });
    }
    else {
        res.send("Invalid frame");
    }
});
app.listen(3520, function () {
    console.log('server started');
});
