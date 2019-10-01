/* eslint-disable prettier/prettier */
var db = require("../models");
var pass = require("../public/js/password.js");
var isLoggedIn = false;

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
  app.post("/newuser", function(req, res) {
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
                    isLoggedIn = true;
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
      } else {
        // duplicate email address
        res.json({
          error: "Email address already exists!"
        });
      }
    });
  });

  app.get("/profile", function(req, res) {
    res.render('profile');
  });

  app.get("/editprofile/:id", function(req, res) {
    db.User.findOne({
      where: {
        id: req.params.id
      },
      include : [
        {
          model: db.Area
        },
        {
          model: db.Skill
        },
        {
          model: db.Genre
        }
      ]
    }).then(function(dbUser){
      console.log(JSON.stringify(dbUser));
      res.render('editprofile', { user: dbUser });
    })
  });

  app.get("/review", function(req, res) {
    isLoggedIn = false;
    res.render('reviewpage');
  });

  // login
  app.get("/login", function(req, res) {
    isLoggedIn = false;
    res.render('login');
  });
  app.post("/login", function(req, res) {
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
          isLoggedIn = true;
          res.json(dbUser);
        } else {
          res.json({
            error: "Invalid email/password!"
          });
        }
      });
    });
  });

  // Load Talent page and pass in an Talent by id
  app.get("/profile/:id", function(req, res) {
    if (!isLoggedIn) {
      return res.status(403).send('Forbidden');
    }
    db.User.findOne({ where: { id: req.params.id } }).then(function(dbUser) {
      res.render("talentPage", {
        Users: dbUser
      });
    });
  });

  app.post("/profile", function(req, res) {
    if (!isLoggedIn) {
      return res.status(403).send('Forbidden');
    }
    console.log(req.body);
    db.User.findOne({
      where: {
        email: req.body.email
      },
      include: [
        {
          model: db.Area
        },
        {
          model: db.Skill
        },
        {
          model: db.Genre
        }
      ]
    }).then(function(dbUser) {
      res.render("profile", { user: dbUser });
    });
  });

  // Render 404 page for any unmatched routes
  app.get("*", function(req, res) {
    res.render("404");
  });
};
