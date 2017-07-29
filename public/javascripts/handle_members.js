$(document).ready(function() {

  // Just in case clear all the join form fields on refresh
   $('#join_form input').val('');

  // Add new member to db when join_btn is clicked
  $('#join_btn').click(function(event){
    event.preventDefault(); // find out why this
    
    // var test = $('input[name="sex-radio"]:checked').val();
    // alert(test)
    
    // Get the label of the radio button
    var gender = '' // Initially the radio is unchecked
    $('input[name="sex-radio"]:checked').each(function() {
      var radioValue = $(this).attr("id");
      gender = $("label[for='"+radioValue+"']").text();
    });

    // Very basic validation (only empty fields). TODO: make better validation.
    var errorCount = 0;
    $('#join_form input').not(':radio').each(function(index,val){
      if ($(this).val() === '') {
        errorCount++;
      }
    });
    
    if(errorCount===0 && (gender==='男' || gender==='女')){

      var newMember = {
                      'namekanji': $('#join_form input#join_name_kanji').val(),
                      'namekana': $('#join_form input#join_name_kana').val(),
                      'email': $('#join_form input#join_email').val(),
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
                // Check for successful response (success)
                if (response.msg === 'success'){
                  // display popup success message
                  alert('New member added successfully!')
                  // clear form inputs
                  $('#join_form input').val('');
                }
                else{
                  // If something went wrong, alert the error message reurned by the service
                  alert('Error: ' + response.msg)
                }
              });
      
    }          
    else {
      // if validation didn't pass, alert the problem
      alert("全ての項目は必須で御座います。")
    }
      
  // /join_btn Click
  });
  
  
// /DOM READY
});

// Clear join_form fields
function clearFields(){
   $('#join_form input').val('');
}