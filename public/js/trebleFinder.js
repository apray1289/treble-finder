$(document).ready(function(){

  $("#registerSubmit").on("submit", function(event) {
    // Make sure to preventDefault on a submit event.
    event.preventDefault();

    var newUser = {
      firstName: $("#inputFirstName").val().trim(),
      lastName: $("#inputLastName").val().trim(),
      password: $("#inputPassword").val().trim(),
      email: $("#inputEmail").val().trim(),
      phone: $("#inputPhone").val().trim(),
      availability: $("#inputArea").val().trim(),
      talents: $("#inputTalentList").val().trim(),
      genres: $("#inputGenreList").val().trim(),
      bio: $("#inputBio").val().trim(),
      soundLink: $("#inputSound").val().trim()
    };

    // Send the POST request.
    $.ajax("/api/newuser", {
      type: "POST",
      data: newUser
    }).then(
      function() {
        console.log("sent new user");
        // Reload the page to get the updated list
        location.reload();
      }
    );
  });

  $("#searchTalentSubmit").on("submit", function(event) {
    // Make sure to preventDefault on a submit event.
    event.preventDefault();

    var newTalentSearch = {
      areaSearch: $("#searchArea").val().trim(),
      talentSearch: $("#searchTalent").val().trim(),
      genreSearch: $("#searchGenre").val().trim(),
    };

    // Send the POST request.
    $.ajax("/api/newuser", {
      type: "POST",
      data: newTalentSearch
    }).then(
      function() {
        console.log("sent new user");
        // Reload the page to get the updated list
        location.reload();
      }
    );
  });

  $("select").selectpicker();

});
 