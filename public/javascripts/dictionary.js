$(document).ready(function(){
  
  // At page ready clear the value in the translation fields
  $("#dict_field").val("");
  $("#translation").val("");
  
  
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
                 When #translate_btn is clicked, uses the input as the dict key to translat
                 Given a word returns the translation in the dictionary {loan_word:japanese_word}
                 Example: translate('クラス') = 授業
                */
                $('#translate_btn').click(function(){
                    var word = $('#dict_field').val();
                    if (word in dictionary) {
                      $('#translation').val(dictionary[word])
                    }
                    else {
                       $('#translation').val("入力された言葉が見つかれません")
                      }
                });
        },
        error: function(){
          // TODO: handle error
        }
        
        
});
