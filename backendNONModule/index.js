var express = require("express");
const PORT = 3001
var app = express();
var bodyparser = require('body-parser')
var cors = require('cors');
var nodemailer = require('nodemailer')
app.use(cors());
app.use(bodyparser.json())
app.use(bodyparser.urlencoded({extended:true}))


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

app.get("/",(req,res)=>{
    res.send("hello")
})



const transporter = nodemailer.createTransport({
    service: "hotmail",
    auth: {
        user: "chellolv@outlook.com",
        pass: "Tpadesktop123"
    }
})

const options = {
    from: "chellolv@outlook.com",
    subject: "Test Chello",
    text: "The main message"
}


app.post("/sendinvitation", (req, res)=>{
    transporter.sendMail({
        ...options,
        to: req.body.to,
        text:req.body.link
    }, function (err, info) {
        res.send(req.body.link)
        if (err) {
            console.log(err);
            return
        }
        console.log("Sent" + info.response);
    })
})