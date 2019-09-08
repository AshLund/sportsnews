// $.getJSON("/headlines", function(data) {
//     for (var i = 0; i <10; i++) {

//     }
//   });

$(document).on("click", ".save", function () {
    var thisId = $(this).attr("data-id");
    
    $.ajax({
        method: "PUT",
        url: "/headlines/" + thisId,
        data: {
            saved: true
        }
    }).then(function() {
        location.reload()
    })
})

$(document).on("click", ".delete", function () {
    var thisId = $(this).attr("data-id");
    
    $.ajax({
        method: "PUT",
        url: "/headlines/" + thisId,
        data: {
            saved: false
        }
    }).then(function() {
        location.reload()
    })
})


$(document).on("click", "p", function() {
    $("#notes").empty();
    var thisId = $(this).attr("data-id");
  
    $.ajax({
      method: "GET",
      url: "/headlines/" + thisId
    })
      .then(function(data) {
        console.log(data);
        $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
        $("#notes").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");
  
        if (data.note) {
          $("#bodyinput").val(data.note.body);
        }
      });
  });
  
  $(document).on("click", "#savenote", function() {
    var thisId = $(this).attr("data-id");
  
    $.ajax({
      method: "POST",
      url: "/headlines/" + thisId,
      data: {
        body: $("#bodyinput").val()
      }
    })
      .then(function(data) {
        console.log(data);
        $("#notes").empty();
      });
  
    $("#bodyinput").val("");
  });



 


