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
  app.post("/api/login", function(req,res){
    var plainPassword = req.body.password;
    db.User.findOne({
      where: {
        email: req.body.email
      }
    }).then(function(dbUser){
      // verify passwords match
      pass.comparePassword(plainPassword, dbUser.password, function(err,match){
        console.log('match', match);
        if (match) {
          res.render('profile', dbUser, function(err,html){
            if (err) {
              res.status(404).send(err);
            } 
            res.send(html);
          });
        } else {
          res.json({
            error: 'Invalid email/password!'
          });
        }
      })
    });
  })

  // Delete an User by id
  app.delete("/api/Users/:id", function(req, res) {
    db.User.destroy({ where: { id: req.params.id } }).then(function(dbUser) {
      res.json(dbUser);
    });
  });
};
