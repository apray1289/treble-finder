require("dotenv").config();
var express = require("express");
var exphbs = require("express-handlebars");
var request = require("request");

var db = require("./models");

var app = express();
var PORT = process.env.PORT || 3000;
var corsOptions = {
  origin: process.env.ORIGIN_URL || "http://localhost",
  optionsSuccessStatus: 200
};


// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static("public"));
app.use("/cors/*", function(req, res) {
  req.pipe(request(req.params[0])).pipe(res);
});


// Handlebars
app.engine(
  "handlebars",
  exphbs({
    defaultLayout: "main"
  })
);
app.set("view engine", "handlebars");

// Routes
require("./routes/apiRoutes")(app);
require("./routes/htmlRoutes")(app);

var syncOptions = { force: false };

// If running a test, set syncOptions.force to true
// clearing the `testdb`
if (process.env.NODE_ENV === "test") {
  syncOptions.force = true;
}

// Starting the server, syncing our models ------------------------------------/
db.sequelize.sync(syncOptions).then(function() {
  app.listen(PORT, function() {
    console.log(
      "==> 🌎  CORS-enabled app listening on port %s. Visit http://localhost:%s/ in your browser.",
      PORT,
      PORT
    );
  });
});

module.exports = app;
