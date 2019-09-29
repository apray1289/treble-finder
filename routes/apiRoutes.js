var db = require("../models");
var pass = require("../public/js/password.js");

module.exports = function(app) {
  // Get all Users
  app.get("/api/Users", function(req, res) {
    db.User.findAll({}).then(function(dbUsers) {
      res.json(dbUsers);
    });
  });

  app.get("/api/skills", function(req, res) {
    db.Skill.findAll({}).then(function(dbUsers) {
      res.json(dbUsers);
    });
  });

  app.get("/api/areas", function(req, res) {
    db.Area.findAll({}).then(function(dbUsers) {
      res.json(dbUsers);
    });
  });

  // Create a new User
  app.post("/api/Users", function(req, res) {
    db.User.create(req.body).then(function(dbUser) {
      res.json(dbUser);
    });
  });

  // login
  app.post("/api/login", function(req, res) {
    var plainPassword = req.body.password;
    db.User.findOne({
      where: {
        email: req.body.email
      }
    }).then(function(dbUser) {
      // verify passwords match
      pass.comparePassword(plainPassword, dbUser.password, function(
        err,
        match
      ) {
        console.log("match", match);
        if (match) {
          res.render("profile", dbUser, function(err, html) {
            if (err) {
              res.status(404).send(err);
            }
            res.send(html);
          });
        } else {
          res.json({
            error: "Invalid email/password!"
          });
        }
      });
    });
  });

  // Delete an User by id
  app.delete("/api/Users/:id", function(req, res) {
    db.User.destroy({ where: { id: req.params.id } }).then(function(dbUser) {
      res.json(dbUser);
    });
  });

  // register
  app.post("/api/newuser", function(req, res) {
    var plainPassword = req.body.password;
    db.User.count({
      where: {
        email: req.body.email
      }
    }).then(function(count) {
      if (count !== 0) {
        // duplicate email address
        res.json({
          error: "Email address already exists!"
        });
      } else {
        db.User.create({}).then(function(dbuser) {
          pass.cryptPassword(plainPassword, function(err, encrypted) {
            var areas = [];
            if (req.body.areas) {
              areas = req.body.areas.split(",");
            }
            var skills = [];
            if (req.body.talents) {
              skills = req.body.talents.split(",");
            }
            var genres = [];
            if (req.body.genres) {
              genres = req.body.genres.split(",");
              console.log(req.body.genres);
              console.log(genres);
            }
            // Create the user
            const newUser = db.User.create({
              firstName: req.body.firstName,
              lastName: req.body.lastName,
              email: req.body.email,
              password: encrypted,
              phone: req.body.phone,
              bio: req.body.bio,
              soundLink: req.body.soundLink
            })
              .then(function(dbUser) {
                // Add areas
                if (areas.length) {
                  dbUser
                    .addAreas(areas, {
                      where: {
                        UserId: dbUser.id
                      }
                    })
                    .then(function() {
                      console.log("areas added");
                    });
                }

                // Add skills
                if (skills.length) {
                  dbUser
                    .addSkills(skills, {
                      where: {
                        UserId: dbUser.id
                      }
                    })
                    .then(function() {
                      console.log("skills added");
                    });
                }

                // Add genres
                if (genres.length) {
                  dbUser
                    .addGenres(genres, {
                      where: {
                        UserId: dbUser.id
                      }
                    })
                    .then(function() {
                      console.log("genres added");
                      res.json(dbUser);
                    });
                }
              })
              .catch(function(err) {
                // handle error;
                res.json({
                  error: err.message
                });
              });
          });
        });
      }
    });
  });

  // find musician with specific area, skill, and genre requirements
  app.post("/api/finduser", function(req, res) {
    var areas = req.body.areas.split(",");
    var skills = req.body.skills.split(",");
    var genres = req.body.genres.split(",");
    db.User.findAll({
      include: [
        {
          model: db.Area,
          where: {
            name: areas
          }
        },
        {
          model: db.Skill,
          where: {
            name: skills
          }
        },
        {
          model: db.Genre,
          where: {
            name: genres
          }
        }
      ]
    }).then(function(dbUsers) {
      res.json(dbUsers);
    });
  });
};
