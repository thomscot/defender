/**************************************************************************
* This js deals with everything related to the #gaini-dictionary section. *
* The user inputs a word in the search box and on btn click a translation *
* is shown in flipping flashcard-like div.                                
***************************************************************************/

// To ignore jQuery warnings from Cloud9 IDE
/* global $ */

$(document).ready(function(){
  
  // At page ready clear the value in the translation fields
  $("#dict_field").val("");
  $("#translation").val("");
  
  // While writing in the search box, write on the front of the flashcard
  $("#dict_field").keyup(function(event) {
      var dict_input = $(this).val();
      $("#print_dict_input").text(dict_input);
      clearCard(dict_input);
  });
  
  // To clear completely the card
  // fixes small bug if user deletes flashcard input without keyup (eg right-click->cut)
  $("#dict_field").focusout(function() {
     var dict_input = $(this).val();
     clearCard(dict_input);
  });
  

});

/*
  Fetch the dictionary file with ajax.
  Split it by new line, and create an object [word:translation]
*/
$.ajax({
        url: "../data/gaini_dictionary.csv",
        // async: false,   // asynchronous request? 
        cache: false,   // force the browser to not make cache of the retrieved data
        dataType: "text",  
        success: function( data, textStatus, jqXHR ) {
                var dictionary = data.split('\n')
                .map(function(x) { return x.split(',') })
                .reduce(function(acc, pair) { // acc = accumulator
                                            acc[pair[0]] = pair[1];
                                            return acc }, {});
                /* 
                 When #translate_btn is clicked, uses the input as the dict key to translate
                 Given a word returns the translation in the dictionary {loan_word:japanese_word}
                 Example: translate('クラス') = 授業
                 // TODO: think how to handle words with a space in dict file. What if users look for オン　デマンド as オンデマンド?
                */
                $('#translate_btn').click(function(){
                    var word = $('#dict_field').val();
                    var trimmed = word.replace(/\s/g,'')
                    if (word in dictionary) {
                      $('#translation').text(dictionary[word]);
                    }　
                    else if (trimmed in dictionary) {
                      $('#translation').text(dictionary[trimmed]);
                    }
                    else {
                      var result = "入力された言葉が\n見つかりません。";
                       $('#translation').text(result);
                       // turn /n into <br> in html 
                       $('#translation').html($('#translation').text().replace(/\n\r?/g, '<br />'));
                      }
                    // then flip the flashcard
                    $('.flashcard').toggleClass('flipped');
                    // and swap front/back IDs.
                    swapFrontBack();
                });
        },
        error: function(){
          // TODO: handle error
        }
        
        
});

// Swap flashcard's front and back IDs
function swapFrontBack(){
  var front = $('#print_dict_input')
  var back = $('#translation')
  front.attr('id', 'translation')
  back.attr('id', 'print_dict_input')
}

// Clear the card if input field is empty
function clearCard(input){
  if (input==''){
    $("#translation").text('')
    $("#print_dict_input").text('')
  }
}