
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));


app.use(cors({
    origin: 'http://localhost:3000'
  }));

class timeSlice{
    timeStamp:string;
    status:string;
    error:string
    constructor(timeStamp:string,status:string,error:string){
        this.timeStamp = timeStamp;
        this.status = status;
        this.error = error;
    }
    getTimeSliceObject(){
        return {
            timeStamp:this.timeStamp,
            status:this.status,
            error:this.error
        }
    }
}

function getTime():Date{
    return new Date()
}
function add1hr(time:Date){
    return new Date(time.getTime() + 60*60*1000);
}

function add6hr(time:Date){
    return new Date(time.getTime() + 6*60*60*1000);
}
function add1day(time:Date){
    return new Date(time.getTime() + 24*60*60*1000);
}


function chooseRandomStatus():string{
    const list = ["running","failed","maintenance"];
    const randomIndex = Math.floor(Math.random() * list.length);
    return list[randomIndex];
}

function chooseRandomError():string{
    const list = ["db write error","UwU error","Where TF is the DATABASE?", "I'm sorry Dave, I'm afraid I can't do that", "DB is not pookie"]
    const randomIndex = Math.floor(Math.random() * list.length);
    return list[randomIndex];
}
function generateJSON(length:number,timeDiffer:string){
    let timeSlices = []
    let time = getTime()
    for(let i = 0; i < length; i++){
        let error;
        let status = chooseRandomStatus()
        if(status === "running"){
            error = "N/A"
        }
        else if(status === "failed"){
            error = chooseRandomError()
        }else{
            error = "N/A"
        }
            
        let timeSliceObj = new timeSlice(time.toISOString(),status,error)
        timeSlices.push(timeSliceObj.getTimeSliceObject())
        if(timeDiffer === "day"){
            time = add1hr(time)
        }else if(timeDiffer === "week"){
            time = add6hr(time)
        }else if(timeDiffer === "month"){
            time = add1day(time)
        }
    }
    return timeSlices
}


app.get('/', (req, res) => {
    res.redirect('/monitor/db-status/24hr');
});

app.get('/monitor/db-status/', (req, res) => {
    const frame = req.query.frame;
    if(frame === "24H"){
        res.send({
            "T":"24H",
            "data":generateJSON(24,"day")
        })
    }else if(frame === "1WK"){
        res.send({
            "T":"1WK",
            "data":generateJSON(28,"week")
        })
    }else if(frame === "1MO"){
        res.send({
            "T":"1MO",
            "data":generateJSON(30,"month")
        })
    }else if(frame==="DEATHWISH"){
        res.send({
            "T":"DEATHWISH",
            "data":generateJSON(5000,"day")
        })
    }
    else{
        res.send("Invalid frame")
    }

})

app.listen(3520, () => {
    console.log('server started');
    console.log('visit, http://localhost:3520');
});