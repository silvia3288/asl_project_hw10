document.addEventListener('DOMContentLoaded', function() {
    console.log("DOMContentLoaded event fired");

    let completedGreetings = localStorage.getItem('completed_greetings') === 'true';
    let completedPhrases = localStorage.getItem('completed_phrases') === 'true';

    console.log("Initial completedGreetings:", completedGreetings);
    console.log("Initial completedPhrases:", completedPhrases);

    function updateButtonStates() {
        let startQuizBtn = document.getElementById('start-quiz-btn');
        let testKnowledgeBtn = document.getElementById('test-knowledge-btn');

        console.log("startQuizBtn:", startQuizBtn);
        console.log("testKnowledgeBtn:", testKnowledgeBtn);

        if (completedGreetings && completedPhrases) {
            if (startQuizBtn) {
                startQuizBtn.classList.remove('disabled');
                startQuizBtn.removeAttribute('data-toggle');
                startQuizBtn.removeAttribute('data-target');
            }
            if (testKnowledgeBtn) {
                testKnowledgeBtn.classList.remove('disabled');
                testKnowledgeBtn.removeAttribute('data-toggle');
                testKnowledgeBtn.removeAttribute('data-target');
            }
        } else {
            if (startQuizBtn) {
                startQuizBtn.classList.add('disabled');
                startQuizBtn.setAttribute('data-toggle', 'modal');
                startQuizBtn.setAttribute('data-target', '#incompleteModal');
            }
            if (testKnowledgeBtn) {
                testKnowledgeBtn.classList.add('disabled');
                testKnowledgeBtn.setAttribute('data-toggle', 'modal');
                testKnowledgeBtn.setAttribute('data-target', '#incompleteModal');
            }
        }
    }

    function handleButtonClick(event) {
        console.log("Button clicked");

        if (!completedGreetings || !completedPhrases) {
            console.log("Lessons not completed, preventing default action");
            event.preventDefault();
            $('#incompleteModal').modal('show'); 
        }
    }

    let startQuizBtn = document.getElementById('start-quiz-btn');
    let testKnowledgeBtn = document.getElementById('test-knowledge-btn');

    if (startQuizBtn) {
        startQuizBtn.addEventListener('click', handleButtonClick);
    }
    if (testKnowledgeBtn) {
        testKnowledgeBtn.addEventListener('click', handleButtonClick);
    }

    window.addEventListener('storage', function(event) {
        console.log("Storage event fired");

        if (event.key === 'completed_greetings') {
            completedGreetings = event.newValue === 'true';
            updateButtonStates();
        } else if (event.key === 'completed_phrases') {
            completedPhrases = event.newValue === 'true';
            updateButtonStates();
        }
    });

    updateButtonStates();
});