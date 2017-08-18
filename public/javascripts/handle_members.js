// To ignore jQuery warnings from Cloud9 IDE
/* global $ */

$(document).ready(function() {

  // Just in case clear all the join form fields on refresh
   $('#join_form input').val('');

  // When join_btn is clicked, we make an ajax call to POST the data to be inserted in the db
  $('#join_btn').click(function(event){
    
    event.preventDefault(); // prevent the form from being submitted

    // Initially the radio is unchecked
    var gender = '' 
   
    $('input[name="sex-radio"]:checked').each(function() {
      var radioValue = $(this).attr("id");
      if (radioValue === 'male-radio') gender = '男';
      else gender = '女';
    });
    
    // var gender = $('input[name="sex-radio"]:checked').val(); why this doesn't work? Returns empty
    
    // Create the new member object
    var newMember = {
      'namekanji': $('#join_form input#join_name_kanji').val(),
      'namekana': $('#join_form input#join_name_kana').val(),
      'email': $('#join_form input#join_email').val(),
      'email_confirm': $('#join_form input#join_email_confirmation').val(),
      'location': $('#join_form input#join_location').val(),
      'age': $('#join_form input#join_age').val(),
      'sex': gender
    }

    // AJAX to post the object to addMember service
    $.ajax({
      type: 'POST',
      data: newMember,
      url: '/members/addmember',
      dataType: 'JSON'
    }).done(function(response){
        // If there were validation messages, clear them
        clearJoinValidation()
        // Validation passed and the request went through.
        if (response.msg === 'success'){
          $('#join_modal').modal('hide');
          $("#join_success").modal('show');
          $('#join_form input').val(''); // clear form inputs
        // validation did not pass. Get errors and append to the form
        } else if (response.msg === 'validation'){
          var errors = response.errors;
          if (errors) {
            $.each(errors, function(index, error) {
              if (error.param==='namekanji'){ $("#join_name_kanji_error").text(error.msg) }
              if (error.param==='namekana'){ $("#join_name_kana_error").text(error.msg) }
              if (error.param==='email'){ $("#join_email_error").text(error.msg) }
              if (error.param==='email_confirm'){ $("#join_email_confirmation_error").text(error.msg) }
              if (error.param==='location'){ $("#join_location_error").text(error.msg) }
              if (error.param==='age'){ $("#join_age_error").text(error.msg) }
              if (error.param==='sex'){ $("#join_sex_error").text(error.msg) }
            });
          } 
        } else if (response.msg === 'email_exists'){
           $("#join_email_error").text(response.error.message)
           $("#join_email_confirmation_error").text(response.error.message)
       
        } else {  
              // Some error occurred. TODO: handle this case better?
              // Should I hide the join_modal?
              $('#join_modal').modal('hide');
              $('#error_message').text(response.msg);
              $("#join_fail").modal('show');
        }
    }); // /ajax callback

  });  // /join_btn Click
}); // /DOM READY

/*
* Helper to clear the fields when closing the modal.
*/
function clearFields(){
  $('#join_form input').val('');

}

function clearJoinValidation(){
  $("#join_name_kanji_error").text('');
  $("#join_name_kana_error").text('');
  $("#join_email_error").text('');
  $('#join_email_confirmation_error').text('');
  $("#join_location_error").text('');
  $("#join_age_error").text('');
  $("#join_sex_error").text('');
}