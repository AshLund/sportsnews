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


$(document).on("click", ".addnote", function() {
    $("#notes").empty();
    var thisId = $(this).attr("data-id");
  
  
    $.ajax({
      method: "GET",
      url: "/headlines/" + thisId,
      data: {
        body:  $("#bodyinput").val()
      }
    })
      .then(function(data) {
        console.log(data);
        $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
        $("#notes").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");
  
      });
  });
  
  $(document).on("click", "#savenote", function() {
     thisId = $(this).attr("data-id");
  
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
    location.reload()
  });

  $(document).on("click", "#deletenote", function() {
    thisId=$(this).attr("data-id");

    $ajax({
      method: "DELETE",
      url: "/headlines/" + thisId,
    }).then(function() {
      location.reload()
    })
  })





 


