var db = require("../models");

module.exports = function(app) {
  // Load index page
  app.get("/", function(req, res) {
    db.User.findAll({}).then(function(dbUsers) {
      res.render("home", {
        msg: "Welcome!",
        Talents: dbUsers
      });
    });
  });

  // Load Talent page and pass in an Talent by id
  app.get("/user/:id", function(req, res) {
    db.Talent.findOne({ where: { id: req.params.id } }).then(function(dbUser) {
      res.render("talentPage", {
        Users: dbUser
      });
    });
  });

  // Render 404 page for any unmatched routes
  app.get("*", function(req, res) {
    res.render("404");
  });
};
