/* eslint-disable prettier/prettier */
var db = require("../models");
var pass = require("../public/js/password.js");

module.exports = function(app) {
  // Load index page
  app.get("/", function(req, res) {
    db.User.findAll({}).then(function(dbUsers) {
      res.render("home", {});
    });
  });
  /**
    get all talents
   */
  app.get("/talent", function(req, res) {
    db.User.findAll({}).then(function(dbUsers) {
      var users = dbUsers;
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
          });
        });
      });
    });
  });

  /**
    Go to registration page
   */
  app.get("/register", function(req, res) {
    db.Area.findAll({}).then(function(dbAreas) {
      var areas = dbAreas;
      db.Skill.findAll({}).then(function(dbSkills) {
        var skills = dbSkills;
        db.Genre.findAll({}).then(function(dbGenres) {
          res.render("register", {
            areas: areas,
            skills: skills,
            genres: dbGenres
          });
        });
      });
    });
  });

  /**
    Add a musician
   */
  app.post("/api/newuser", function(req, res) {
    // make sure the email address is unique
    db.User.count({
      where: {
        email: req.body.email
      }
    }).then(function(c) {
      if (c === 0) {
        console.log("Adding musician", req.body);
        pass.cryptPassword(req.body.password, function(err, encrypted) {
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
          }).then(function(dbUser) {
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

                  res.render("profile", dbUser, function(){
                    console.log('rendered');
                  });

                });
            }

            
          }).catch(function (err) {
            // handle error;
            res.json({
              error: err.message
            });
          });
        });
      } else {
        // duplicate email address
        res.json({
          error: "Email address already exists!"
        });
      }
    });
  });

  // Load Talent page and pass in an Talent by id
  app.get("/profile/:id", function(req, res) {
    db.User.findOne({ where: { id: req.params.id } }).then(function(dbUser) {
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
