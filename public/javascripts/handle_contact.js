$(document).ready(function() {

 
  // The user click to submit the contact form
  $('#contact_submit').click(function(event){
    
    event.preventDefault(); // prevent the form from being submitted
    
    // Delete if exists
    $('#contact_errors > ul').remove();

    var contactData = {
      'contact_name': $('#contact_form input#contact_name').val(),
      'contact_email': $('#contact_form input#contact_email').val(),
      'contact_subject': $('#contact_form input#contact_subject').val(),
      'contact_message': $('#contact_form textarea#contact_message').val()
    }
    
    

    // AJAX to post the object to contact service
    $.ajax({
      type: 'POST',
      data: contactData,
      url: '/contact/contact',
      dataType: 'JSON'
    }).done(function(response){
        // If there were validation errors, clear them
        clearValidation();
        // Validation passed and the request went through.
        if (response.msg === 'success'){
         alert('success')
        } else if (response.msg === 'validation'){
          var errors = response.contact_errors;
          console.log(errors)
          if (errors) {
            $.each(errors, function(index, error) {
              if (error.param==='contact_name'){ $("#contact_name_error").text(error.msg) }
              if (error.param==='contact_email'){ $("#contact_email_error").text(error.msg) }
              if (error.param==='contact_subject'){ $("#contact_subject_error").text(error.msg) }
              if (error.param==='contact_message'){ $("#contact_message_error").text(error.msg) }
            });
          } 
        // Some error occurred. TODO: handle this case better?
        } else {
            alert('Error: ' + response.msg)
        }
    }); // /ajax callback

  });  // /join_btn Click
}); // /DOM READY


/*
* Clear the validation fields
*/
function clearValidation(){
  $("#contact_name_error").text('');
  $("#contact_email_error").text('');
  $("#contact_subject_error").text('');
  $("#contact_message_error").text('');
}