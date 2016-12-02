$(document).ready(function(){
console.log("script loaded")
//ajax request to search character via comic vine api
  var getData = function(nameSearch){
    // var appID= config.MY_KEY;
    //info on hiding api keys https://gist.github.com/derzorngottes/3b57edc1f996dddcab25
    // var MY_KEY= process.env.MY_KEY;
    return $.ajax({
      url: 'http://comicvine.com/api/search/?api_key=' + MY_KEY +'&query=' + nameSearch + '&format=json',
      method: 'GET',
      success: function(data){
        console.log(data);
        handleResponse(data);
      }
      // beforeSend: setHeader("Access-Control-Allow-Origin", "http://www.comicvine.gamespot.com/")
    })
  }
  //search function to find character info;
  var addAJAXFunction = function(data){
    $('#submitButton').click(function(event){
      event.preventDefault();
      var $name = $('input').val();
      getData($name);
      console.log($name);
      $('.inputBox').addClass('hide');
    })}
  //changes text to display character data and picture
  var handleResponse = function(data){
    //clear information on load
    $('#information').html(" ")
    $('#des').html(" ")
    //assigning variables for objects
    var nameSearch = data.results[0].name;
    var imageData= data.results[0].image.icon_url;
    $('#profileImg').css('background-image', 'url("'+ imageData+'")')
    var overview=data.results[0].deck;
    var description=data.results[0].description;


    //profile data
    var realName= data.results[0].real_name;
    var aliases= data.results[0].aliases;
    aliases = aliases.replace(/\r\n/g, ", ");
    //https://appendto.com/2016/02/replace-spaces-underscores-javascript/ replacing items in a string
    var dob= data.results[0].birth;
    var publisher= data.results[0].publisher.name;

    $('.resultContainer').removeClass('hide');
    $('#charTitle').html(nameSearch);
    $('#information').html(overview);
    $('#des').html(description);
    $('#realName').html("Real Name: " + realName);
    $('#aliases').html("Aliases: " + aliases);
    $('#dob').html("DOB: "+ dob);
    $('#publisher').html("Publisher: " + publisher);

    //fixing broken links and redirecting them to the comic vine page
    $('a').each(function(index, el) {
      var path = $(el).attr('href')
      //if href starts with http://stackoverflow.com/questions/5102315/jquery-href-attribute-starting-with-tag
      if (path !== $("a[href^='http']")) {
        $(el).attr('href', 'http://www.comicvine.com'+path);
      };
    });
     /* save info to db in post route*/
    $('#save').click(function(event) {
      var saveData = {
          name: nameSearch,
          image: imageData
        }
      console.log(saveData)
      $.ajax({
        url: '/save',
        method: 'post',
        data: saveData
      })
      alert("Character Saved!");
      $('#nothing').removeClass('hide');
    });
    //changing locations onclick
    $('#home').click(function(event) {
      window.location.replace("/home");
    });


  };
  //call search here
  addAJAXFunction()
  $('#signup').click(function(event){
    alert("Thanks for signing up with us!")
  })
  $('#account').click(function(event) {
    window.location.replace("/user");
  });
  $('#update').click(function(event){
    alert("User information updated!")
  })
})
