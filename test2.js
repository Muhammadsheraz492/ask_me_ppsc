const nodemailer=require("nodemailer")

function SendEmail  () {

    var transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'razakhan.yt0012@gmail.com',
        pass: 'cvmzenrnkczdipxe'
      }
    });
  
    var mailOptions = {
      from: 'razakhan.yt0012@gmail.com',
      to: "bahoo.hub@gmail.com",
      subject: 'Sending Email using Node.js',
      text: "12213"
    };
  
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
  }

  SendEmail();