const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const logBook = require('./models/logBook');
const sg = require('@sendgrid/mail');
const EmailAPI_KEY = process.env.EAPI_KEY;
const client = require('twilio')(process.env.SID,process.env.TOKEN);
sg.setApiKey(EmailAPI_KEY);

 mongoose.connect(process.env.MONGO_URL)
        .then(()=>{console.log('connected with database')})
        .catch((err)=>{ console.log('error occured')
         console.log(err);})

app.set('view engine','ejs')
app.set('views',path.join(__dirname,'views'))
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));


app.get('/',(req,res)=>{
    res.render('home');
});

var eArray = [];
var pArray = [];
app.post('/',(req,res)=>{

    const {name, roll, classs, parentPhone, parentEmail} = req.body;

    console.log({name, roll, classs, parentPhone, parentEmail})
    var currentdate = new Date(); 
    var logDate = currentdate.getDate() + "/"
                + (currentdate.getMonth()+1)  + "/" 
                + currentdate.getFullYear() + " @ "  
                + currentdate.getHours() + ":"  
                + currentdate.getMinutes() + ":" 
                + currentdate.getSeconds();

    logBook.create({name, roll, classs, parentPhone, parentEmail, logDate});

    eArray.push(parentEmail);
    pArray.push(parentPhone);

    const message = {
        to: `${parentEmail}`,
        from: 'nanomonkey1611@gmail.com',
        subject: 'Your child just checked in to school',
        text: `Greetings! Your child ${name}, roll number ${roll}, class ${classs} just checked into school at time ${logDate}`,
    }
    sg.send(message)
    .then((res)=>{
        console.log('email sent successfully');
    })
    .catch((err)=>{
        console.log(err)
    })

    client.messages
    .create({
     body: `Greetings! Your child ${name}, roll number ${roll}, class ${classs} just checked into school at time ${logDate}`,
     from: '+17743415527',
     to: `+${parentPhone}`
     })
    .then(message => console.log(message.sid))
    .catch((err)=>{
        console.log(err)
    })

    res.render('nextSub')
})


app.post('/send',(req,res)=>{

    console.log(pArray);
    console.log(eArray);
    
   for(let i=0;i<pArray.length;i++)
   {

     const message2 = {
        to: `${eArray[i]}`,
        from: 'nanomonkey1611@gmail.com',
        subject: 'School Time Over!',
        text: `Greetings! School timings are over.Your child has boarded school bus for home. Please pick them up from bus stop.`,
    }
    sg.send(message2)
    .then((res)=>{
        console.log('email sent successfully');
    })
    .catch((err)=>{
        console.log(err)
    })

      client.messages
    .create({
     body: `Greetings! School timings are over.Your child has boarded school bus for home. Please pick them up from bus stop.`,
     from: '+17743415527',
     to: `+${pArray[i]}`
     })
    .then(message => console.log(message.sid))
    .catch((err)=>{
        console.log(err)
    })
       
   }
    res.render('home');
})
app.listen(process.env.PORT||3000,()=>{
console.log("server is up and running on port 3000")
})