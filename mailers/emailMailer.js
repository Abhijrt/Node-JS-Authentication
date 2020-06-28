const nodeMailer = require("../config/nodemailer");
exports.forgotPassword = (detail) => {
  // for render the template
  //   let htmlString = nodeMailer.renderTemplate(
  //     { comment: comment },
  //     "/emailTemp.ejs"
  //   );
  console.log("details", detail);
  console.log("Inside forgot password mailer");
  //   for sending the mail
  nodeMailer.tranporter.sendMail(
    {
      from: "abhi.jrt12@gmail.com", //email that send the mail
      to: detail.email,
      subject: "Forgot password link send",
      //   html: htmlString,
      html: "<h1>Good to go</h1>",
    },
    (err, info) => {
      if (err) {
        console.log("error in searching mail", info, err);
        return;
      }
      console.log("Message Sent!");
      return;
    }
  );
};
