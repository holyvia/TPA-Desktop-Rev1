const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
    service: "hotmail",
    auth: {
        user: "chellolv@outlook.com",
        pass: "Tpadesktop123"
    }
})

const options = {
    from: "chellolv@outlook.com",
    to: "gabriel.mintana@binus.edu",
    subject: "Test Chello",
    text: "The main message"
}

transporter.sendMail(options, function (err, info) {
    if (err) {
        console.log(err);
        return
    }
    console.log("Sent" + info.response);
})