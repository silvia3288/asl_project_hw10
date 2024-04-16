$(document).ready(function(){
    $('#startQuiz').click(function(){
        window.location.href = window.location.href + "/1";
    })

    // set up question page
    $("#quiz_ques").html(question["question"]);

    // mc
    if(question["if_multiple_choice"] == "true"){
        $("#ques_img").attr("src", question["images"]);
        $.each(question["choices"], function(index, value){
            let checkbox = $('<input type="checkbox"></input>');
            checkbox.attr("id", index);
            let label;
            if(value.includes("http")){
                label = $('<label></label>');
                label.attr("for", index);
                let img_choice = $('<img class="img-responsive img-fluid">');
                img_choice.attr("src", value);
                label.append(img_choice);
                checkbox.attr("name", "image"+index);
                checkbox.attr("value", "image"+index);
            }
            else{
                label = $('<label></label><br><br>');
                label.attr("for", index);
                label.html(value);
                checkbox.attr("name", value);
                checkbox.attr("value", value);
               
            }
            $("#ans_choices").append(checkbox).append(label);
            
        })
    }

    // drag and drop
    else{
        $.each(question["images"], function(index, value){
            let choice = $('<img class="img-responsive img-fluid draggable">');
            choice.attr("src", value);
            $("#imgs_drag").append(choice);
        })
    }

    $( ".draggable" ).draggable({
        revert: "invalid",
        stack: ".draggable"
    });

    $( "#droppable" ).droppable({
        hoverClass: "ui-state-active",
        drop: function( event, ui ) {
            $( this )
                .addClass( "ui-state-highlight" )
                .find( "div" ); 
            $( ".draggable" ).draggable({
                revert: "invalid"
            });
        }
    });
})