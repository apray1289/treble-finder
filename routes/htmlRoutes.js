var db = require("../models");

module.exports = function(app) {
  // Load index page
  app.get("/", function(req, res) {
    db.User.findAll({}).then(function(dbUsers) {
      res.render("home", {});
    });
  });

  app.get("/talent", function(req, res) {
    db.User.findAll({}).then(function(dbUsers) {
      var users = dbUsers;
      console.log(users.length);
      db.Area.findAll({}).then(function(dbAreas) {
        var areas = dbAreas;
        db.Skill.findAll({}).then(function(dbSkills) {
          var skills = dbSkills;
          db.Genre.findAll({}).then(function(dbGenres) {
            res.render("talentpage", {
              users: users,
              areas: areas,
              talents: skills,
              genres: dbGenres
            });
          })[]
        });
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
  // app.get("*", function(req, res) {
  //   res.render("404");
  // });
};
