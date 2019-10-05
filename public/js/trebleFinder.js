/* eslint-disable prettier/prettier */
/* eslint-disable quotes */
$(document).ready(function () {

  function isInvalidForm() {


    if (!$("#inputFirstName").val()) {
      return { message: "Missing first name!", id: '#inputFirstName' };
    };

    if (!$("#inputPassword").val()) {
      return { message: "Missing password!", id: '#inputPassword' };
    };

    if (!$("#inputEmail").val()) {
      return { message: "Missing email address!", id: '#inputEmail' };
    };

    if (!$("#inputPhone").val()) {
      return { message: "Missing phone number!", id: '#inputPhone' };
    };

    if (areas().length === 0) {
      return { message: "Missing available locations!", id: '#inputGenreList' };
    }

    if (skills().length === 0) {
      return { message: "Missing musical talents!", id: '#inputTalentList' };
    }

    if (genres().length === 0) {
      return { message: "Missing musical genres!", id: '#inputGenreList' };
    }

    return null;
  }

  var areas = function () {
    var results = [];
    $.each($("#slect-area option:selected"), function () {
      results.push($(this).val());
    });
    if (results.length === 0) {
      $.each($("#inputArea option:selected"), function () {
        results.push($(this).val());
      });
    }

    return results;
  };

  var skills = function () {
    var results = [];
    $.each($("#select-skill option:selected"), function () {
      results.push($(this).val());
    });
    if (results.length === 0) {
      $.each($("#inputTalentList option:selected"), function () {
        results.push($(this).val());
      });
    }

    
    return results;
  };

  var genres = function () {
    var results = [];
    $.each($("#slect-genre option:selected"), function () {
      results.push($(this).val());
    });
    if (results.length === 0) {
      $.each($("#inputGenreList option:selected"), function () {
        results.push($(this).val());
      });
    }


    return results;
  };

  // Register new musician
  $("#registerSubmit").on("click", function (event) {
    // Make sure to preventDefault on a submit event.
    event.preventDefault();

    var errObj = isInvalidForm();

    if (errObj) {
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
      soundLink: $("#inputSound").val(),
    };

    // Send the POST request.
    $.ajax("/newuser", {
      type: "POST",
      data: newUser
    }).then(function (data) {
      console.log("sent new user");
      // Reload the page to get the updated list
      if (data.error) {
        $('#inputEmail').focus();
        alert(data.error);
      } else {
        window.location = '/profile/' + data.id;
      }
    }).fail(function (err) {
      if (err.status !== 0) {
        alert(JSON.stringify(err));
      }
    });

  });

  $("#editProfileSubmit").on("click", function (event) {

    event.preventDefault();

    var errObj = isInvalidForm();

    if (errObj) {
      $('.modal-body').text(errObj.message);
      $("#myModal").modal();
    }

    if (errObj) {
      $(errObj.id).focus();
      return;
    }

    var currentUser = {
      firstName: $("#inputFirstName").val(),
      lastName: $("#inputLastName").val(),
      password: $("#inputPassword").val(),
      email: $("#inputEmail").val(),
      phone: $("#inputPhone").val(),
      areas: areas().join(","),
      talents: skills().join(","),
      genres: genres().join(","),
      bio: $("#inputBio").val(),
      soundLink: $("#inputSound").val(),
      id: $("#user-id").attr('data-id')
    };
    $.ajax("/editProfile", {
      type: "PUT",
      data: currentUser
    }).then(function (data) {
      console.log("edited current user");
      // Reload the page to get the updated list
      if (data.error) {
        $('#inputEmail').focus();
        alert(data.error);
      } else {
        $.redirect("/profile", { email: data.email }, "POST", "_blank");
      }
    }).fail(function (err) {
      if (err.status !== 0) {
        alert(JSON.stringify(err));
      }
    });
  });
  // login
  $('#loginSubmit').on('click', function (event) {
    event.preventDefault();

    if (!$("#loginEmail").val()) {
      return { message: "Missing email!", id: '#loginEmail' };
    };

    if (!$("#loginPassword").val()) {
      return { message: "Missing password!", id: '#loginPassword' };
    };

    var user = {
      email: $('#loginEmail').val(),
      password: $('#loginPassword').val()
    };
    $.ajax("/login", {
      type: "POST",
      data: user
    }).then(function (data) {
      // console.log("/profile?" + data.id);
      // window.location = "/profile?" + data.id;
    }).fail(function (err) {
      if (err.status !== 0) {
        alert(JSON.stringify(err));
      }
    });
  });

  // find musicians with specific requirements (area, skill, genre)
  $("#searchTalentSubmit-old").on("click", function (event) {
    // Make sure to preventDefault on a submit event.
    event.preventDefault();
   
    var newTalentSearch = {
      areas: areas(),
      skills:skills(),
      genres: genres()
    };
    console.log('newTalentSearch', newTalentSearch);
    // Send the POST request.
    var queryString = Object.keys(newTalentSearch).map(key => key + '=' + newTalentSearch[key]).join('&');
    window.location = "/finduser?" + newTalentSearch;
    // $.ajax("/finduser", {
    //   type: "GET",
    //   data: newTalentSearch
    // }).then(function (data) {
    //  // console.log("found talents",data);     

    // });
  });

  $("selectpicker").selectpicker();
});
