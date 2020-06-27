// When a home page open this controller will work
module.exports.home = function (req, res) {
  return res.render("home", {
    title: "Home Page",
  });
};
