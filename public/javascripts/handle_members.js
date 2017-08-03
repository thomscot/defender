// $(document).ready(function() {

//   // Just in case clear all the join form fields on refresh
//   $('#join_form input').val('');

//   // Add new member to db when join_btn is clicked
//   $('#join_btn').click(function(event, req, res){
//     //event.preventDefault(); // find out why this
    
//     // Get the label of the radio button
//     var gender = '' 
//     $('input[name="sex-radio"]:checked').each(function() {
//       var radioValue = $(this).attr("id");
//       gender = $("label[for='"+radioValue+"']").text();
//     });

//     // Very basic validation (only empty fields). TODO: make better validation.
// //     var errorCount = 0;
// //     $('#join_form input').not(':radio').each(function(index,val){
// //       if ($(this).val() === '') {
// //         errorCount++;
// //       }
// //     });
    
// // //    if(errorCount===0 && (gender==='男' || gender==='女')){

// //       if (errorCount ===0){

//       var newMember = {
//                       'namekanji': $('#join_form input#join_name_kanji').val(),
//                   //   'namekana': $('#join_form input#join_name_kana').val(),
//                       'email': $('#join_form input#join_email').val()
//                       // 'location': $('#join_form input#join_location').val(),
//                       // 'age': $('#join_form input#join_age').val(),
//                       // 'sex': gender
//                       }
                      
//       // AJAX to post the object to addMember service
//       $.ajax({
//               type: 'POST',
//               data: newMember,
//               url: '/members/addmember',
//               dataType: 'JSON'
//               }).done(function(response){
//                 // Check for successful response (success)
//                 if (response.msg === 'success'){
//                   // display popup success message
//                   alert('New member added successfully!')
//                   // clear form inputs
//                   $('#join_form input').val('');
//                 }
//                 else if (response.msg === 'validation'){  
//                     console.log('validation');
//                     var errors = response.err;
                    
//                     console.log(response.err)
//                   //response.render('index')
//                 }
//                 else{
//                   // If something went wrong, alert the error message reurned by the service
//                   alert('Error: ' + response.msg)
//                 }
//               });
      
//     // }          
//     // else {
//     //   // if validation didn't pass, alert the problem
//     //   alert("全ての項目は必須で御座います。")
//     // }
      
//   // /join_btn Click
//   });
  
  
// /DOM READY
//});


$(document).ready(function() {

  // Just in case clear all the join form fields on refresh
   $('#join_form input').val('');

  // Add new member to db when join_btn is clicked
  $('#join_btn').click(function(event){
    
    event.preventDefault(); // prevent the form from being submitted
    // Delete if exists
    $('#join_errors > ul').remove();

    // Get the label of the radio button
    var gender = '' // Initially the radio is unchecked
    $('input[name="sex-radio"]:checked').each(function() {
      var radioValue = $(this).attr("id");
      gender = $("label[for='"+radioValue+"']").text();
    });
    
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
        // Some error occurred. TODO: handle this case better?
        } else {
            alert('Error: ' + response.msg)
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