document.addEventListener('DOMContentLoaded', function() {
    // Parse the JSON data passed from the template
    let phrases = JSON.parse('{{ popular_items|tojson|safe }}');
    let greetings = JSON.parse('{{ go_go|tojson|safe }}');



    // Get the session identifier from the server
    const serverSessionId = '{{ session_id }}';

    // Check if the stored session identifier matches the server session identifier
    const storedSessionId = localStorage.getItem('sessionId');

    if (storedSessionId !== serverSessionId) {
        // Clear all local storage items related to visited items
        localStorage.clear();

        // Store the new session identifier in localStorage
        localStorage.setItem('sessionId', serverSessionId);
    }
    
    // if (storedSessionId !== serverSessionId) {
    //     // If the session identifiers don't match, clear the visited state data
    //     greetings.forEach(item => {
    //         localStorage.removeItem(item.id);
    //     });

    //     phrases.forEach(item => {
    //         localStorage.removeItem(item.id);
    //     });
    //     // Store the new session identifier
    //     localStorage.setItem('sessionId', serverSessionId);
    // }

    function displayGreetings(items) {
        const container = document.getElementById('greetings-container');
        container.innerHTML = '';
        items.forEach(item => {
            const buttonElement = document.createElement('button');
            buttonElement.className = 'greeting-btn';
            buttonElement.innerText = item.name;

            // Check if the item has been visited
            if (localStorage.getItem(item.id) === 'visited') {
                buttonElement.classList.add('visited');
            }

            buttonElement.onclick = function () {
                localStorage.setItem(item.id, 'visited');
                window.location.href = "/view/" + item.id;
            };
            container.appendChild(buttonElement);
    });

    function displayPhrases(items) {
        const container = document.getElementById('phrases-container');
        container.innerHTML = '';
        items.forEach(item => {
            const buttonElement = document.createElement('button');
            buttonElement.className = 'greeting-btn';
            buttonElement.innerText = item.name;

            // Check if the item has been visited
            if (localStorage.getItem(item.id) === 'visited') {
                buttonElement.classList.add('visited');
            }

            buttonElement.onclick = function () {
                localStorage.setItem(item.id, 'visited');
                window.location.href = "/view/" + item.id;
            };
            container.appendChild(buttonElement);
        });
    }

    displayPhrases(phrases);
    displayGreetings(greetings)

    // Refresh the buttons when the page regains focus
    window.addEventListener('focus', function() {
        displayGreetings(greetings);
        displayPhrases(phrases);
    });
});
