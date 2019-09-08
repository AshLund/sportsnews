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





$(document).on("click", "p", function () {
    var thisId=$(this).attr("data_id");

$.ajax({
    method: "GET",
    url: "/headlines/" + thisId
})
});

$(document).on("click", "#savenote",
function() {
    var thisId=$(this).attr("data-id");

$.ajax({
    method: "POST",
    url: "/headlines/" + thisId,
    data: {
        title: $("#titleinput").val(),
        body: $("#bodyinput").val(),
    }
})
.then(function(data) {
    console.log(data);
    $("#notes").empty();
});

$("#titleinput").val("");
$("#bodyinput").val(""); 

});

