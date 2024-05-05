$(document).ready(function(){
    $('#startQuiz').click(function(){
        window.location.href = window.location.href + "/1";
    });

    // set up question page
    $("#quiz_ques").html(question["question"]);

    // mc
    if (question["if_multiple_choice"] == "true") {
        $("#ques_img").attr("src", question["images"]);
        $.each(question["choices"], function(index, value) {
            let checkbox = $('<input type="checkbox"></input>');
            checkbox.attr("id", 'choice' + index);
            checkbox.attr("class", 'choice-checkbox'); // Added class for checkboxes
            let label;
            if (value.includes("http")) {
                label = $('<label></label>');
                label.attr("for", 'choice' + index);
                let img_choice = $('<img class="img-responsive img-fluid">');
                img_choice.attr("src", value);
                label.append(img_choice);
                checkbox.attr("name", "image" + index);
                checkbox.attr("value", index);
            } else {
                label = $('<label></label><br><br>');
                label.attr("for", 'choice' + index);
                label.attr("class", 'text-white');
                label.html(value);
                checkbox.attr("name", value);
                checkbox.attr("value", index);
            }
            $("#ans_choices").append(checkbox).append(label);
        });
    }

    // drag and drop
    else{
        $.each(question["images"], function(index, value){
            let choice = $('<img class="img-responsive img-fluid draggable" data-index="' + index + '">');
            choice.attr("src", value);
            $("#imgs_drag").append(choice);
        });


        $( ".draggable" ).draggable({
            revert: "invalid",
            stack: ".draggable"
        });

        $("#droppable").droppable({
            hoverClass: "ui-state-highlight",
            drop: function(event, ui) {
                const draggedItemId = $(ui.draggable).data("index");
                const correct = question["answer_index"].includes(draggedItemId);

                //correct response
                $.ajax({
                    url: '/quiz/' + question.id,
                    type: 'POST',
                    contentType: 'application/json',
                    data: JSON.stringify({ answer: [draggedItemId] }),
                    dataType: 'json',
                    success: function(response) {
                        // $('#drag_feedback').text(response.feedback).show();
                        //
                        // if (response.is_correct) {
                        //     $('#drag_feedback').addClass('alert-success').removeClass('alert-danger');
                        // } else {
                        //     $('#drag_feedback').addClass('alert-danger').removeClass('alert-success');
                        // }

                        $('#drag_feedback').empty();  // Clear previous feedback
                        let feedbackIcon;  // Declare the variable to hold the icon

                        if (response.is_correct) {
                            feedbackIcon = $('<svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" fill="green" class="bi bi-check-circle-fill" viewBox="0 0 16 16" style="margin-right: 10px;"><path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/> </svg>');
                            $('#drag_feedback').addClass('alert-success').removeClass('alert-danger').prepend(feedbackIcon).append(response.feedback);
                        } else {
                            feedbackIcon = $('<svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" fill="red" class="bi bi-x-circle-fill" viewBox="0 0 16 16" style="margin-right: 10px;"><path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293z"/></svg>')
                            $('#drag_feedback').addClass('alert-danger').removeClass('alert-success').prepend(feedbackIcon).append(response.feedback);
                        }

                        $('#drag_feedback').show();

                        if (response.next_question_id) {
                            $('#drag_nextQuestion').text("Next Question").show().on('click', function() {
                                window.location.href = '/quiz/' + response.next_question_id;
                            });
                        } else {
                            $('#drag_nextQuestion').text("Finish Quiz").show().on('click', function() {
                                window.location.href = '/quiz_results';
                            });
                        }
                    },
                    error: function(xhr, status, error) {
                        console.error("Error in submission:", status, error);
                        $('#drag_feedback').text("An error occurred. Please try again.").show();
                    }
                });

                // incorrect response
                if (!correct) {
                    $('#drag_feedback').addClass('alert-danger').removeClass('alert-success').text(question['wrong_response']).show();

                    if (question.id < Object.keys(quiz_questions).length) {
                        $('#drag_nextQuestion').text("Next Question").show().on('click', function() {
                            window.location.href = '/quiz/' + (parseInt(question.id) + 1);
                        });
                    } else {
                        $('#drag_nextQuestion').text("Finish Quiz").show().on('click', function() {
                            window.location.href = '/quiz_results';
                        });
                    }
                }
            }
        });
    }


    // Initially disable the submit button
    $('#submit_ans').prop('disabled', true);

    // Enable the submit button only if at least one checkbox is checked
    $('input[type="checkbox"]').change(function() {
        const anyChecked = $('input[type="checkbox"]:checked').length > 0;
        $('#submit_ans').prop('disabled', !anyChecked);
    });

    // submit button and ajax call for feedback
    $('#submit_ans').click(function() {
        const answers = $("input[type='checkbox']:checked").map(function() {
            return parseInt($(this).val()); // Make sure it's the correct method to fetch the value
        }).get(); // This should naturally be an array

        // ajax post to submit answers
        $.ajax({
            url: '/quiz/' + question.id,
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ answer: answers }),
            dataType: 'json',
            success: function(response) {

                $('#feedback').empty();  // Clear previous feedback
                let feedbackIcon;  // Declare the variable to hold the icon

                if (response.is_correct) {
                    feedbackIcon = $('<svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" fill="green" class="bi bi-check-circle-fill" viewBox="0 0 16 16" style="margin-right: 10px;"><path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/> </svg>');
                    $('#feedback').addClass('alert-success').removeClass('alert-danger').prepend(feedbackIcon).append(response.feedback);
                } else {
                    feedbackIcon = $('<svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" fill="red" class="bi bi-x-circle-fill" viewBox="0 0 16 16" style="margin-right: 10px;"><path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293z"/></svg>')
                    $('#feedback').addClass('alert-danger').removeClass('alert-success').prepend(feedbackIcon).append(response.feedback);
                }

                $('#feedback').show();

                $('.choice-checkbox').each(function() {
                    $(this).attr('disabled', true);  // Disable checkboxes
                    var choiceIndex = parseInt($(this).val());
                    if (question['answer_index'].includes(choiceIndex)) {
                        $(this).next('label').addClass(response.is_correct ? 'correct-answer' : 'wrong-answer');
                    }
                });

                if (response.next_question_id) {
                    $('#nextQuestion').text("Next Question").show().data('next-id', response.next_question_id);
                } else {
                    $('#nextQuestion').text("Finish Quiz").show().on('click', function() {
                        window.location.href = '/quiz_results';
                    });
                }
            },
            error: function(xhr, status, error) {
                console.error("Error in submission:", status, error);
                $('#feedback').text("An error occurred. Please try again.").show();
            }
        });
    });


    $('#nextQuestion').on('click', function() {
        let nextId = $(this).data('next-id');
        if(nextId) {
            window.location.href = '/quiz/' + nextId;
        } else {
            window.location.href = '/quiz_results';
        }
    });
});
