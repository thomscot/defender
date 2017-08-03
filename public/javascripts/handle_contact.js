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
        // Validation passed and the request went through.
        if (response.msg === 'success'){
         alert('success')
        } else if (response.msg === 'validation'){
          var errors = response.contact_errors;
          console.log(errors)
          if (errors) {
            var ul = $("<ul>");
            $.each(errors, function(index, error) {
              ul.append($('<li>').text(error.param + ' ' + error.msg));
            });
            ul.css({"color":"red"}); // temp basic style
            $('#contact_errors').append(ul);
          } 
        // Some error occurred. TODO: handle this case better?
        } else {
            alert('Error: ' + response.msg)
        }
    }); // /ajax callback

  });  // /join_btn Click
}); // /DOM READY
