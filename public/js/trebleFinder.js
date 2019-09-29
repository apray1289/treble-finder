/* eslint-disable prettier/prettier */
/* eslint-disable quotes */
$(document).ready(function() {

  function isInvalidForm () {
    

    if (!$("#inputFirstName").val()) {
      return {message: "Missing first name!", id: '#inputFirstName' };
    };

    if (!$("#inputPassword").val()) {
      return {message: "Missing password!", id: '#inputPassword' };
    };

    if (!$("#inputEmail").val()) {
      return {message: "Missing email address!", id: '#inputEmail' };
    };

    if (!$("#inputPhone").val()) {
      return {message: "Missing phone number!", id: '#inputPhone' };
    };

    if (areas().length === 0) {
      return {message: "Missing available locations!", id: '#inputGenreList' };
    }

    if (skills().length === 0) {
      return {message: "Missing musical talents!", id: '#inputTalentList' };
    }

    if (genres().length === 0) {
      return {message: "Missing musical genres!", id: '#inputGenreList' };
    }

    return null;
  }

  var areas = function() {
    var results = [];
    $.each($("#inputArea option:selected"), function() {
      results.push($(this).val());
    });

    return results;
  }

  var skills = function() {
    var results = [];
    $.each($("#inputTalentList option:selected"), function() {
      results.push($(this).val());
    });

    return results;
  }
    
  var genres = function() {
    var results = [];
    $.each($("#inputGenreList option:selected"), function() {
      results.push($(this).val());
    });

    return results;
  }


  $("#registerSubmit").on("click", function(event) {
    // Make sure to preventDefault on a submit event.
    event.preventDefault();

    var errObj = isInvalidForm();

    if (errObj){
      $('.modal-body').text(errObj.message);
      $("#myModal").modal();      
    }

    if (errObj) {
      $(errObj.id).focus();
      return;
    }

    var newUser = {
      firstName: $("#inputFirstName").val(),
      lastName: $("#inputLastName").val(),
      password: $("#inputPassword").val(),
      email: $("#inputEmail").val(),
      phone: $("#inputPhone").val(),
      areas: areas().join(","),
      talents: skills().join(","),
      genres: genres().join(","),
      bio: $("#inputBio").val(),
      soundLink: $("#inputSound").val()
    };

    // Send the POST request.
    $.ajax("/newuser", {
      type: "POST",
      data: newUser
    }).then(function(data) {
      console.log("sent new user");
      // Reload the page to get the updated list
      if (data.error) {        
        $('#inputEmail').focus();
        alert(data.error);
      } else {
        console.log(window.location);
      }
    }).fail(function(err) {
      alert(JSON.stringify(err));
    });
  });

  // find musicians with specific requirements (area, skill, genre)
  $("#searchTalentSubmit").on("click", function(event) {
    // Make sure to preventDefault on a submit event.
    event.preventDefault();

    var newTalentSearch = {
      areas: areas(),
      skills: skills(),
      genres: genres()
    };

    // Send the POST request.
    $.ajax("/finduser", {
      type: "POST",
      data: newTalentSearch
    }).then(function() {
      console.log("sent new user");
      // Reload the page to get the updated list
      location.reload();
    });
  });

  $("selectpicker").selectpicker();
});
