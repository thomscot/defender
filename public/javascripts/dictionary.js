$(document).ready(function(){
  
  // At page ready clear the value in #dict_form
  $("#dict_field").val("");
  
  
});

/*
  Fetch the dictionary file with ajax.
  Split it by new line, and create an object [word:translation]
*/
$.ajax({
        url: "../data/test.csv",
        // async: false,   // asynchronous request? 
        cache: false,   // force the browser to not make cache of the retrieved data
        dataType: "text",  
        success: function( data, textStatus, jqXHR ) {
                var dictionary = data.split('\n')
                .map(function(x) { return x.split(',') })
                .reduce(function(acc, pair) { 
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
                      $('#dict_field').val(dictionary[word])
                    }
                    else {
                       $('#dict_field').val("入力された言葉が見つかれません")
                      }
                });
        },
        error: function(){
          // TODO: handle error
        }
        
        
});
