const nodemailer = require("nodemailer");
const ejs = require("ejs");
const path = require("path");

// create the transporter to use gmail as a service
let tranporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  post: 587,
  secure: false,
  auth: {
    user: "", //email id which send the mail
    pass: "", //password of the gmail
  },
});

//if we use the template then we render the template aslo
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
