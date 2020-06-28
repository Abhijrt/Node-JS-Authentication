const nodemailer = require("nodemailer");
const ejs = require("ejs");
const path = require("path");

let tranporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  post: 587,
  secure: false,
  auth: {
    user: "abhi.jrt12@gmail.com", //email id which send the mail
    pass: "abhirlajj", //password of the gmail
  },
});

let renderTemplate = (data, relativePath) => {
  let mailHTML;
  ejs.renderFile(
    path.join(__dirname, "../views/mailers", relativePath),
    data,
    function (err, template) {
      if (err) {
        console.log("error in rendering templates");
        return;
      }
      mailHTML = template;
    }
  );
  return mailHTML;
};

module.exports = {
  tranporter: tranporter,
  renderTemplate: renderTemplate,
};
