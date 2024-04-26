document.addEventListener('DOMContentLoaded', function() {
    // Parse the JSON data passed from the template
    let phrases = JSON.parse('{{ popular_items|tojson|safe }}');

    function displayPhrases(items) {
        const container = document.getElementById('phrases-container');
        container.innerHTML = '';
        items.forEach(item => {
            const buttonElement = document.createElement('button');
            buttonElement.className = 'greeting-btn';
            buttonElement.innerText = item.name;

            // Check if the item has been visitedphrases-container
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

    // Add the 'visited' class to previously visited phrases
    phrases.forEach(item => {
        const buttonElement = document.querySelector(`button[data-id="${item.id}"]`);
        if (localStorage.getItem(item.id) === 'visited') {
            buttonElement.classList.add('visited');
        }
    });
});
