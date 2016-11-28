$(document).ready(function(){
console.log("script loaded")

//ajax request to search character via comic vine api
  var getData = function(nameSearch){
    var appID= config.MY_KEY;
    return $.ajax({
      url: 'http://www.comicvine.com/api/search/?api_key=' + appID +'&query=' + nameSearch + '&format=json',
      method: 'GET',
      success: function(data){
        console.log(data.results);
        handleResponse(data);
      }

      // beforeSend: setHeader("Access-Control-Allow-Origin", "http://www.comicvine.gamespot.com/")
    })
  }
//search function to find character info;
  var addAJAXFunction = function(data){
    $('button').click(function(event){
      event.preventDefault();
      var $name = $('input').val();
      getData($name);
      console.log(data);
      console.log($name);
    })}
//changes text to display character data and picture
  var handleResponse = function(data){
    var nameSearch = data.results[0].name;
    var imageData= data.results[0].image.icon_url;
    $('body').append('<img src='+ imageData+'>')
    var description=data.results[0].deck
    $.each(data.results,function(i,val){
      var para= val.deck
      console.log(para)
    })
    console.log(description)
    $('#information').text("You're looking for " + nameSearch + description+  "here's a picture");
  };
//call search here
addAJAXFunction()
})
