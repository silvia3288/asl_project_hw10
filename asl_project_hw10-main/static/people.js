$(document).ready(function() {
    // Initialize a JavaScript variable with item.id
    // This should be defined in your view_item.html inside a <script> tag, not here


    
   


    $("#reviewForm").on("submit", function(event) {
        event.preventDefault(); // Prevent the default form submission behavior
        const reviewContent = document.getElementById('reviewContent').value;

        if (!reviewContent) {
            alert("Review cannot be empty.");
            return;  // Stop the function if the review is empty
        }

        console.log("Review submission triggered for Item ID:", itemId);
        console.log("Review content:", reviewContent);

        fetch(`/add_review/${itemId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ content: reviewContent }),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log("Server response:", data);
            // Update the UI to show the new review
            const reviewsList = document.querySelector('.user-reviews ul');
            const newReview = document.createElement('li');
            newReview.classList.add('user-review-item');
            newReview.innerHTML = `<strong>${data.user_name}</strong>: ${data.content}`;
            reviewsList.prepend(newReview);
            // Clear the textarea after submission
            document.getElementById('reviewContent').value = '';
        })
        .catch(error => {
            console.error('Error during fetch:', error);
        });
    });


    $('#discardChanges').click(function(e) {
        e.preventDefault(); // Prevent default button behavior
        
        var itemId = $(this).data('item-id'); // Get the item ID from the data attribute
        
        // Show confirmation dialog
        var userConfirmed = confirm('Are you sure you want to discard changes?');
    
        if (userConfirmed) {
            // Redirect to the view page using the item ID
            window.location.href = "/view/" + itemId;
        }
    });
    

    $("#submit_all_form_data").click(function(e){
        console.log("submit_all_form_data")
        e.preventDefault();
        // validation first 
        if (!validateForm()) {
            // If validation fails, return false and prevent form submission
            highlightInvalidFields();
            return false;
        }
        
        // If the data is valid i get the data and send it to the server route 
        // do an AJAX 
        // view_item

        let form_data = $('form').serializeArray();
        let selectedRestaurantId = $('#similar_id').val();
        let selectedRestaurantName = $('#similar_id option:selected').text();
    
        // Check if a restaurant is selected
        if (selectedRestaurantId && selectedRestaurantName !== "Select a restaurant") {
            form_data.push({ name: "similar_id", value: selectedRestaurantId });
            form_data.push({ name: "similar_name", value: selectedRestaurantName });
        }
        
        // let similarId = $('#similar_id').val();
        // let similarName = $('#similar_id option:selected').text();
        // form_data.push({ name: "similar_id", value: similarId });
        // form_data.push({ name: "similar_name", value: similarName });
        $.ajax({
            url: '/add_data',
            type: 'POST',
            data: form_data,
            success: function(response) {
                // Redirect to the view_item page for the newly added item
                $('#responseMessage').html('New item successfully created. <a href="/view/' + response.id + '">See it here</a>');
                $('#addItemForm').trigger("reset");  // Clear the form for new entry
                $('#name').focus(); 
                //window.location.href = '/view/' + response.id;
            },
            error: function(xhr, status, error) {
                console.error('Error submitting form data:', error);
            }
        });

    

    })


    

    function populateRestaurantNamesDropdown() {
        const restaurantDropdown = document.getElementById('similar_id');
    
        if (restaurantDropdown) {
            // Clear existing options
            restaurantDropdown.innerHTML = '<option value="">Select a restaurant</option>';
    
            // Fetch restaurant names and IDs
            $.ajax({
                url: '/names',
                type: 'GET',
                success: function(restaurants) {
                    console.log("Received restaurant information:", restaurants);
                    restaurants.forEach(restaurant => {
                        const option = document.createElement('option');
                        option.value = restaurant.id;
                        option.textContent = restaurant.name;
                        restaurantDropdown.appendChild(option);
                    });
                },
                error: function(xhr, status, error) {
                    console.error('Error fetching restaurant information:', error);
                }
            });
        } else {
            console.error("Dropdown element not found.");
        }
    }

    
    // Call the function to populate the dropdown when the document is ready
    populateRestaurantNamesDropdown();
    
   
   

    // const postUrl = `/add_review/${itemId}`;
    

    // // Function to handle the review submission
    // function submitReview(event) {
    //     event.preventDefault(); // Prevent the default form submission behavior
    //     console.log("Review submission triggered", "Item ID:", itemId);
    
    //     const reviewContent = document.getElementById('reviewContent').value;
    //     console.log("Review content:", reviewContent);
    
    //     const postUrl = `/add_review/${itemId}`;
    
    //     fetch(postUrl, {
    //         method: 'POST',
    //         headers: {
    //             'Content-Type': 'application/json',
    //         },
    //         body: JSON.stringify({ content: reviewContent }),
    //     })
    //     .then(response => {
    //         if (!response.ok) {
    //             throw new Error('Network response was not ok');
    //         }
    //         return response.json();
    //     })
    //     .then(data => {
    //         console.log("Server response:", data);
    //         const reviewsList = $('.user-reviews ul');
    //         const newReview = `<li class="user-review-item"><strong>Silvia</strong>: ${data.content}</li>`;
    //         reviewsList.prepend(newReview);
    //         document.getElementById('reviewContent').value = '';
    //     })
    //     .catch(error => {
    //         console.error('Error during fetch:', error);
    //     });
    // }
    
    // $(document).ready(function() {
    //     $("#reviewForm").on("submit", submitReview);
    // });
    
    // Attach the submitReview function to the form's submit event
    // $("#reviewForm").on("submit", function(event) {
    //     console.log("line 84")
    //     // Prevent the default form submission behavior
    //     event.preventDefault();
        
    //     // Display confirmation dialog
    //     var confirmSubmit = confirm("Are you sure you want to submit?");
    //     if (confirmSubmit) {
    //         // If confirmation is received, proceed with the review submission
    //         submitReview(event);
    //     }
    // });
    //this code is not being used 
    
    // Function to validate form fields
    function validateForm() {
        var nameInput = document.getElementById('name');
        var cuisineInput = document.getElementById('cuisine');
        var priceRange = document.getElementById('price_range');
        var reservationInput = document.getElementById('reservation');
        var maxSizeInput = document.getElementById('max_size');
        var similarInput = document.getElementById('similar_id');
        var reviewInput = document.getElementById('reviews');
        var highlightsInput = document.getElementById('highlights');
        console.log("Validating form fields");

        // Add validation for other fields as needed

        var isValid = true;
        /// Must delete this later!!
        // return true;

        // Check if name, cuisine, and price range fields are not blank
        if (nameInput.value.trim() === '') {
            nameInput.classList.add('is-invalid');
            isValid = false;
        } else {
            nameInput.classList.remove('is-invalid');
        }
        if (cuisineInput.value.trim() === '') {
            cuisineInput.classList.add('is-invalid');
            isValid = false;
        } else {
            cuisineInput.classList.remove('is-invalid');
        }
        if (priceRange.value === "Choose") {
            priceRange.classList.add('is-invalid');
            isValid = false;
        } else {
            priceRange.classList.remove('is-invalid');
        }
        if (reservationInput.value === 'Choose') {
        reservationInput.classList.add('is-invalid');
        isValid = false;
        } else {
        reservationInput.classList.remove('is-invalid');
        }
        if (maxSizeInput.value === 'Choose') {
        maxSizeInput.classList.add('is-invalid');
        isValid = false;
        } else {
        maxSizeInput.classList.remove('is-invalid');
        }
        if (similarInput.value === 'Select a restaurant:') {
        similarInput.classList.add('is-invalid');
        isValid = false;
        } else {
        similarInput.classList.remove('is-invalid');
        }
        if (reviewInput.value.trim() === '') {
        console.log("Review is invalid");
        reviewInput.classList.add('is-invalid');
        isValid = false;
        } else {
        reviewInput.classList.remove('is-invalid');
        }
        if (highlightsInput.value.trim() === '') {
        console.log("Review is invalid");
        reviewInput.classList.add('is-invalid');
        isValid = false;
        } else {
        highlightsInput.classList.remove('is-invalid');
        }


        return isValid;
}


    function highlightInvalidFields() {
        // Clear existing 'is-invalid' classes from all form fields
        $('input, select').removeClass('is-invalid');

        // Check if name, cuisine, and price range fields are not blank
        if ($('#name').val().trim() === '') {
            $('#name').addClass('is-invalid');
        }
        if ($('#cuisine').val().trim() === '') {
            $('#cuisine').addClass('is-invalid');
        }
        if ($('#price_range').val() === 'Choose') {
            console.log("highlited");
            $('#price_range').addClass('is-invalid');
        }
        if ($('#reservation').val() === 'Choose') {
            $('#reservation').addClass('is-invalid');
        } else {
            $('#reservation').removeClass('is-invalid');
        }
        if ($('#max_size').val() === 'Choose') {
            $('#max_size').addClass('is-invalid');
        } else {
            $('#max_size').removeClass('is-invalid');
        }
        if ($('#reviews').val().trim() === '') {
            $('#reviews').addClass('is-invalid');
        } else {
            $('#reviews').removeClass('is-invalid');
        }
        if ($('#Similar_id').val() === 'Select a restaurant:') {
            console.log("Similar_id");
            $('#Similar_id').addClass('is-invalid');
        } else {
            $('#Similar_id').removeClass('is-invalid');
        }
        if ($('#highlights').val().trim() === '') {
            $('#highlights').addClass('is-invalid');
        } else {
            $('#highlights').removeClass('is-invalid');
        }

        // Add similar checks for other fields as needed
    }
});

    // Attach confirmation dialog to form submission
    // $("#addItemForm").on("submit", function(event) {
    //     console.log("line 152");
    //     // Prevent the default form submission behavior
    //     event.preventDefault();
        
    //     // Validate the form
    //     if (!validateForm()) {
    //         // If form validation fails, prevent submission
    //         return;
    //     }
        
    //     // Display confirmation dialog
    //     var confirmSubmit = confirm("Are you sure you want to submit?");
    //     if (confirmSubmit) {
    //         // If confirmation is received, allow the form submission
    //         this.submit();
    //     }
    // });





document.addEventListener('DOMContentLoaded', function() {
    // Get the elements
    var studentBudgetSlider = document.getElementById('student_budget');
    var studentRatingSlider = document.getElementById('student_rating');
    var studentBudgetValue = document.getElementById('student_budget_value');
    var studentRatingValue = document.getElementById('student_rating_value');

    // Update the value when slider is moved
    // studentBudgetSlider.addEventListener('input', function() {
    //     studentBudgetValue.innerText = studentBudgetSlider.value;
    // });

    // studentRatingSlider.addEventListener('input', function() {
    //     studentRatingValue.innerText = studentRatingSlider.value;
    // });
});

document.getElementById('student_budget').addEventListener('input', function() {
    document.getElementById('student_budget_value').textContent = this.value;
});

document.getElementById('student_rating').addEventListener('input', function() {
    document.getElementById('student_rating_value').textContent = this.value;
});




document.addEventListener('DOMContentLoaded', function() {
    const imageUrlInput = document.getElementById('image');
    const imageUploadInput = document.getElementById('image_upload');
    const imagePreview = document.getElementById('imagePreview');

    // Function to update image preview
    function updateImagePreview(url) {
        imagePreview.src = url;
        imagePreview.style.display = url ? 'block' : 'none';  // Hide if no URL
    }


    // Listen for changes in the image URL input field
    imageUrlInput.addEventListener('input', function() {
        if (imageUrlInput.value.trim() !== '') {
            // Update the image preview
            updateImagePreview(imageUrlInput.value.trim());
            // If the image URL input is not blank, disable the image upload input
            imageUploadInput.disabled = true;
        } else {
            // Clear and hide the image preview
            updateImagePreview('');
            // If the image URL input is blank, enable the image upload input
            imageUploadInput.disabled = false;
        }
    });

    // Listen for changes in the image upload input field
    // imageUploadInput.addEventListener('change', function() {
    //     if (imageUploadInput.files && imageUploadInput.files[0]) {
    //         // Use FileReader to get the uploaded file's URL and update the preview
    //         var reader = new FileReader();
    //         reader.onload = function(e) {
    //             updateImagePreview(e.target.result);
    //         };
    //         reader.readAsDataURL(imageUploadInput.files[0]);
    //         // Clear the image URL input
    //         imageUrlInput.value = '';
    //     }
    // });
});