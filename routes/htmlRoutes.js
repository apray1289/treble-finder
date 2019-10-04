/* eslint-disable prettier/prettier */
var db = require("../models");
var pass = require("../public/js/password.js");
var isLoggedIn = false;

module.exports = function (app) {
  // Load index page
  app.get("/", function (req, res) {
    db.User.findAll({}).then(function (dbUsers) {
      res.render("home", {});
    });
  });
  /**
    get all talents
   */
  var allAreas = [];
  var allSkills = [];
  var allGenres = [];
  app.get("/talent", function (req, res) {
    db.Area.findAll({}).then(function (dbAreas) {
      allAreas = dbAreas;
      db.Skill.findAll({}).then(function (dbSkills) {
        allSkills = dbSkills;
        db.Genre.findAll({}).then(function (dbGenres) {
          allGenres = dbGenres;
          res.render("talentpage", {
            areas: allAreas,
            skills: allSkills,
            genres: allGenres,
            authorized: isLoggedIn
          });
        });
      });
    });
  });

  /**
    Go to registration page
   */
  app.get("/register", function (req, res) {
    db.Area.findAll({}).then(function (dbAreas) {
      var areas = dbAreas;
      db.Skill.findAll({}).then(function (dbSkills) {
        var skills = dbSkills;
        db.Genre.findAll({}).then(function (dbGenres) {
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
  app.post("/newuser", function (req, res) {
    // make sure the email address is unique
    db.User.count({
      where: {
        email: req.body.email
      }
    }).then(function (c) {
      if (c === 0) {
        console.log("Adding musician", req.body);
        pass.cryptPassword(req.body.password, function (err, encrypted) {
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
            .then(function (dbUser) {
              // Add areas
              if (areas.length) {
                dbUser
                  .addAreas(areas, {
                    where: {
                      UserId: dbUser.id
                    }
                  })
                  .then(function () {
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
                  .then(function () {
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
                  .then(function () {
                    console.log("genres added");
                    isLoggedIn = true;
                    res.json(dbUser);
                  });
              }
            })
            .catch(function (err) {
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

  app.get("/profile", function (req, res) {
    if (isLoggedIn) {
      res.render('profile');
    } else {
      return res.status(403).send('Forbidden');
    }
  });

  app.get("/editprofile/:id", function (req, res) {
    if (!isLoggedIn) {
      return res.status(403).send('Forbidden');
    }

    db.User.findOne({
      where: {
        id: req.params.id
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
    }).then(function (dbUser) {
      console.log(JSON.stringify(dbUser));
      res.render('editprofile', { user: dbUser });
    })
  });

  app.get("/review", function (req, res) {
    isLoggedIn = false;
    res.render('reviewpage');
  });

  // login
  app.get("/login", function (req, res) {
    isLoggedIn = false;
    res.render('login');
  });
  app.post("/login", function (req, res) {
    var plainPassword = req.body.password;
    db.User.findOne({
      where: {
        email: req.body.email
      }
    }).then(function (dbUser) {
      // verify passwords match
      pass.comparePassword(plainPassword, dbUser.password, function (
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
  app.get("/profile/:email", function (req, res) {

    db.User.findOne({ where: { email: req.params.email } }).then(function (dbUser) {

      res.render("profile", {
        user: dbUser
      });
    });

  });

  app.get('/finduser', function (req, res) {
    var { areas, skills, genres } = req.query;

    db.Area.findAll({
      include: [{ model: db.User }]
    }).then(function (data) {
      var userAreaArray = [];
      if (areas) {
        for (var i in data) {
          for (var index in areas) {
            if (data[i].name === areas[index]) {
              if (data[i].Users[0]) {
                if (isUnique(userAreaArray, data[i].Users[0])) {
                  userAreaArray.push(data[i].Users[0]);
                }
              }
            }
          }
        }
      }

      console.log('userAreaArray', userAreaArray.length);

      db.Skill.findAll({
        include: [{ model: db.User }]
      }).then(function (data) {
        var userSkillArray = [];
        if (skills) {
          for (var i in data) {
            for (var index in skills) {
              if (data[i].name === skills[index]) {
                if (data[i].Users[0]) {
                  if (isUnique(userSkillArray, data[i].Users[0])) {
                    userSkillArray.push(data[i].Users[0]);
                  }
                }
              }
            }
          }
        }

        console.log('userSkillArray', userSkillArray.length);

        db.Genre.findAll({
          include: [{ model: db.User }]
        }).then(function (data) {
          var userGenreArray = [];
          if (genres) {
            for (var i in data) {
              for (var index in genres) {
                if (data[i].name === genres[index]) {
                  if (data[i].Users[0]) {
                    if (isUnique(userGenreArray, data[i].Users[0])) {
                      userGenreArray.push(data[i].Users[0]);
                    }
                  }
                }
              }
            }
          }

          console.log('userGenreArray', userGenreArray.length);

          

          var foundTalent = false;
          var users = [];
          if ((userAreaArray.length !== 0) && (userSkillArray.length !== 0) && (userGenreArray.length !== 0)) {
            if ((areas.length !== 0) && (skills.length !== 0) && (genres.length !== 0)) {
              console.log('1 match!');
              foundTalent = true;
              users = userAreaArray;
            } else {
              console.log('1 no match!');
            }
          } else if ((userAreaArray.length !== 0) && (userSkillArray.length !== 0)) {
            if ((areas.length !== 0) && (skills.length !== 0)) {
              console.log('2 match!');
              // find common users
              var email;
              for (var i in userAreaArray) {
                email = userAreaArray[i].email;
                for (var j in userSkillArray) {
                  if (email === userSkillArray[j].email) {
                    users.push(userAreaArray[i]);
                  }
                }
              }
              foundTalent = (users.length !== 0);
            } else {
              console.log('2 no match!');
            }
          } else if ((userAreaArray.length !== 0) && (userGenreArray.length !== 0)) {
            if ((areas.length !== 0) && (genres.length !== 0)) {
              console.log('3 match!');
              var email;
              for (var i in userAreaArray) {
                email = userAreaArray[i].email;
                for (var j in userGenreArray) {
                  console.log(email + ' vs ' + userGenreArray[j].email);
                  if (email === userGenreArray[j].email) {
                    users.push(userAreaArray[i]);
                  }
                }
              }
              foundTalent = (users.length !== 0);
            } else {
              console.log('3 no match!');
            }
          } else if ((userSkillArray.length !== 0) && (userGenreArray.length !== 0)) {
            if ((skills.length !== 0) && (genres.length !== 0)) {
              console.log('4 match!');
              var email;
              for (var i in userSkillArray) {
                email = userSkillArray[i].email;
                for (var j in userGenreArray) {
                  if (email === userGenreArray[j].email) {
                    users.push(userSkillArray[i]);
                  }
                }
              }
              foundTalent = (users.length !== 0);
            } else {
              console.log('4 no match!');
            }
          }
          console.log('foundTalent', foundTalent)

          if (foundTalent) {
            res.render('talentpage', {
              users: users,
              areas: allAreas,
              skills: allSkills,
              genres: allGenres,
              authorized: isLoggedIn
            });
          } else {
            res.json({
              error: 'Nothing found! Try again'
            })
          }

        })
      })
    })
  });

  // Render 404 page for any unmatched routes
  app.get("*", function (req, res) {
    res.render("404");
  });
};


function isUnique(arr, val) {
  var found = false;
  arr.forEach(element => {
    if (element.email === val.email) {
      found = true;
    }
  });

  return !found;
}