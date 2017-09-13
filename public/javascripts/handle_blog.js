$(document).ready(function() {
  
  // Load the article
  $.get("/data/dogen.txt", function(txt) {
    $('#dogen').text(txt);
  })    
  
  
});