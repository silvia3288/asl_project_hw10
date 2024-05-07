$(document).ready(function(){
    displayQuestions();

    // check if all text boxes are filled to enable the submit button
    function enableSubmitIfReady() {
        let allFilled = true;
        for (let i = 1; i < 4; i++) {
            if ($('#g-box' + i).val() === '') {
                allFilled = false;
                break;
            }
        }
        $('#submit_g').prop('disabled', !allFilled);
    }

    // check text boxes on keyup and paste events
    $('input[type="text"]').on('keyup paste', function() {
        enableSubmitIfReady();
    });

    // initial check in case of any prefilled values
    enableSubmitIfReady();

    // entering quiz answers + checking + displaying results
    $('#submit_g').click(function() {
        let correct = [];
        for (let i = 1; i < 4; i++) {
            let quiz_id = "#g-box" + i;
            let ans = $(quiz_id).val();
            console.log(ans);
            let ifcorrect = checkAnswers(ans, i);
            if(ifcorrect){
                let good_res = $('<span class="ml-2">Good job!</span>')
                let checkmark = $('<svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" fill="green" class="bi bi-check-circle-fill" viewBox="0 0 16 16"><path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/> </svg>')
                checkmark.attr("id", i.toString())
                $("#g-res"+ i).css("background-color", "#a4d7a4");
                $("#g-res"+ i).css("color", "var(--dark-grey");
                $("#g-res"+ i).append(checkmark).append(good_res);
            }
            else{
                let wrong_text;
                if(questions[i]['answers'].length > 1){
                    wrong_text = "Oops! The correct answer is: <strong>" + questions[i]['answers'][0] + " or " + questions[i]['answers'][1] +"</strong>";
                }
                else{
                    wrong_text = "Oops! The correct answer is: <strong>" + questions[i]['answers'][0] +"</strong>";
                }
                let wrong_res = $('<span>></span>');
                wrong_res.html(wrong_text);
                wrong_res.attr("class", "ml-2");
                let xmark = $('<svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" fill="red" class="bi bi-x-circle-fill" viewBox="0 0 16 16"><path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293z"/></svg>')
                xmark.attr("id", i.toString());
                $("#g-res"+ i).css("background-color", "#e6acb2");
                $("#g-res"+ i).css("color", "var(--dark-grey");
                $("#g-res"+ i).append(xmark).append(wrong_res);
            }
            $('#submit_g').prop('disabled', true);
        }
    });
    $('#g-box3').keypress(function(e){
        if(e.which == 13){
            $('#submit_g').click();
        }
    });
})

function displayQuestions(){
    for (let i = 1; i < 4; i++) {
        let quiz_id = "#g-q" + i;
        let quiz_col = $(quiz_id);
        console.log(quiz_id);
        let q_img = $('<img class="img-responsive img-fluid">');
        q_img.attr("src", questions[i]["image"]);
        quiz_col.append(q_img);
    }
}

function checkAnswers(ans, i){
    // preprocess ans
    let regex = /^[a-zA-Z\s]*$/; // check if all letters and spaces
    if(!regex.test(ans)){
        return false;
    }

    ans = ans.toLowerCase();
    if(questions[i]["answers"].includes(ans)){
        return true;
    }
    else{
        return false;
    }
}