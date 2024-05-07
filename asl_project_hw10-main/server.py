from flask import Flask, render_template, request, redirect, url_for, session, jsonify, Response, flash
from collections import defaultdict
from markupsafe import Markup, escape
import re
import random
from urllib.parse import urlparse, parse_qs
import uuid



# Generate a unique session identifier when the server starts
session_id = str(uuid.uuid4())


app = Flask(__name__)
app.secret_key = 'secret_key'

current_id = 9
data = [
    {
        "id": "1",
        "name": "Hello",
        "ASL Translation": "Hello",
        "image_steps": "https://res.cloudinary.com/spiralyze/image/upload/f_auto,w_auto/BabySignLanguage/DictionaryPages/hello.svg",
        "video": "https://www.youtube.com/watch?v=Yth5OaV2H5c",
        "pro_tip_text": "There are two ways of saying hello, choose the one that fits your mood",

    },
    {
    "id": "2",
    "name": "What is your name?",
    "ASL Translation": "YOU-NAME-WHAT",
        "image_steps": "https://media.baamboozle.com/uploads/images/820398/1655476629_39457.jpeg",
        "video": "https://www.youtube.com/watch?v=6pZ_KvSXMOg",
        "pro_tip_text":  "Squint your eyebrows when asking a question that starts with the word 'what'",

  },
  {
    "id": "3",
    "name": "Nice to meet you",
    "ASL Translation": "NICE-MEET-YOU",
        "image_steps": "https://us-static.z-dn.net/files/dd5/1c1d4aee72f8c5c7d2217cb17d957266.jpg",
        "video": "https://www.youtube.com/watch?v=k3BsgBGWc3I",
        "pro_tip_text":  " Always pair this with another greeting, such as “hello” or “good morning",

  },
  {
    "id": "4",
    "name": "How are you?",
    "ASL Translation": "HOW-YOU",
        "image_steps": "data:image/png;base64,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",
        "video": "https://www.youtube.com/watch?v=WrK3EQjPhsM",
        "pro_tip_text":  " Use your facial expressions to indicate a question",
       },
  {
    "id": "5",
    "name": "Goodbye",
   "ASL Translation": "GOODBYE",
        "image_steps": "https://kidscarehomehealth.com/wp-content/uploads/2022/08/KCHH-sign-language-goodbye.jpg",
        "video": "https://www.youtube.com/watch?v=4rOC5fNt-_k",

       },
  {
        "id": "6",
        "name": "Thank you",
        "ASL Translation": "THANK-YOU",
        "image_steps": "https://res.cloudinary.com/spiralyze/image/upload/f_auto,w_auto/BabySignLanguage/DictionaryPages/thank_you.svg",
        "video": "https://www.youtube.com/watch?v=EPlhDhll9mw",

        },
    {
    "id": "7",
    "name": "I'm Sorry",
    "ASL Translation": "SORRY",
        "image_steps": "https://res.cloudinary.com/spiralyze/image/upload/f_auto,w_auto/BabySignLanguage/DictionaryPages/sorry.svg",
        "video": "https://www.youtube.com/watch?v=osP-ZD3H3ms",
        "pro_tip_text":  "Make an apologetic expression to go with this sign",
        },
  {
    "id": "8",
    "name": "Excuse me",
    "ASL Translation": "EXCUSE",
        "image_steps": "data:image/png;base64,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",
        "video": "https://www.youtube.com/watch?v=YlEL7MpKRQM",
        "pro_tip_text":  "Sometimes this motion is repeated to express politeness",
       },
  {
    "id": "9",
    "name": "Please",
    "ASL Translation": "PLEASE",
        "image_steps": "https://res.cloudinary.com/spiralyze/image/upload/f_auto,w_auto/BabySignLanguage/DictionaryPages/please.svg",
        "video": "https://www.youtube.com/watch?v=wtNN6H27L3k",
        "pro_tip_text":  "Use dominant hand and circular motion counter clockwise",
       },
  {
    "id": "10",
    "name": "Bathroom",
    "ASL Translation": "BATHROOM or TOILET",
        "image_steps": "https://res.cloudinary.com/spiralyze/image/upload/f_auto,w_auto/BabySignLanguage/DictionaryPages/bathroom.svg",
        "video": "https://www.youtube.com/watch?v=jeqwQxDWXwE",
        "pro_tip_text":  " Use your dominant hand for this sign",
        },

  {
    "id": "11",
    "name": "Help",
   "ASL Translation": "HELP",
        "image_steps": "https://res.cloudinary.com/spiralyze/image/upload/f_auto,w_auto/BabySignLanguage/DictionaryPages/help.svg",
        "video": "https://www.youtube.com/watch?v=Euz1g9E-Mrw",
        "pro_tip_text":  "You can repeat the up-and-down motion of this sign without changing the meaning",
        }



]

quiz_questions = {
    1 : {
        "id": "1",
        "question": "Which of the following words/phrases matches the sign below? Choose all that apply.",
        "choices": ["Bathroom", "Toilet", "How are you?", "Please"],
        "answer_index": [0, 1],
        "if_multiple_choice": "true",
        "images" : ["https://www.lifeprint.com/asl101/gifs/b/bathroom.gif"],
        "correct_response": "Good job! This sign means both bathroom and toilet.",
        "wrong_response": "Oops! Looks like you got it wrong. This sign means both bathroom and toilet."
    },
    2 : {
        "id": "2",
        "question": "Which of the following words/phrases matches the sign below? Choose all that apply.",
        "choices": ["Sorry", "Excuse me", "Goodbye", "Thank you"],
        "answer_index": [1],
        "if_multiple_choice": "true",
        "images" : ["https://www.lifeprint.com/asl101/gifs/e/excuse.gif"],
        "correct_response": "Great job! This is the sign for excuse me.",
        "wrong_response": "Oops! This sign means excuse me."
    },
    3 : {
        "id": "3",
        "question": "Which of the following signs is a greeting? Drag the correct image into the box below.",
        "choices": [],
        "answer_index":[0],
        "if_multiple_choice": "false",
        "images" : ["https://media.baamboozle.com/uploads/images/820398/1655476629_39457.jpeg", "https://res.cloudinary.com/spiralyze/image/upload/f_auto,w_auto/BabySignLanguage/DictionaryPages/please.svg"],
        "correct_response": "Great job! This sign means what’s your name? The other sign means please, which is not a greeting.",
        "wrong_response": "Oops, that's wrong! You picked the sign for please, which is not a greeting. The correct choice is the sign for what's your name?"
    },
    4 : {
        "id": "4",
        "question": "Which of the following is most important to remember when signing 'I'm sorry'?",
        "choices": ["Use dominant hand", "Sign clockwise", "Repeat the sign", "Use appropriate facial expressions"],
        "answer_index": [3],
        "if_multiple_choice": "true",
        "images" : [],
        "correct_response": "Good job! Using an apologetic expression helps convey the sign earnestly",
        "wrong_response": "Oops! The most important aspect for signing 'I'm sorry' is an earnest apologetic expression."
    },
    5 : {
        "id": "5",
        "question": "Which of the following words/phrases matches the sign below? Choose all that apply.",
        "choices": ["Excuse me", "Nice to meet you", "Help", "Bathroom"],
        "answer_index": [2],
        "if_multiple_choice": "true",
        "images" : ["https://media.istockphoto.com/id/1351210641/photo/deaf-woman-show-her-hand-for-help-or-aid-as-sign-language-deaf-body-language-concept.jpg?s=612x612&w=0&k=20&c=BvYv_RY4vduNY2Vo18w-3UgTzPxRrIgpWToxJ54CVKQ="],
        "correct_response": "Good job! This sign means help.",
        "wrong_response": "Oops! This sign means help, and is signed by moving the thumbs up up and down."
    },
    6 : {
        "id": "6",
        "question": "Which of the following can be used when meeting someone new? Choose all that apply.",
        "choices": ["https://media.baamboozle.com/uploads/images/820398/1655476629_39457.jpeg", "https://us-static.z-dn.net/files/dd5/1c1d4aee72f8c5c7d2217cb17d957266.jpg", "https://res.cloudinary.com/spiralyze/image/upload/f_auto,w_auto/BabySignLanguage/DictionaryPages/bathroom.svg"],
        "answer_index": [0, 1],
        "if_multiple_choice": "true",
        "images" : [],
        "correct_response": "Good job! These signs mean 'nice to meet you' and 'what's your name?' The other sign means 'bathroom'.",
        "wrong_response": "Oops! The correct signs are options 1 and 2, which mean 'nice to meet you' and 'what's your name?'. The other option means 'bathroom' which is not a way to greet someone."
    },
    7 : {
        "id": "7",
        "question": "Which of the following is most important to remember when signing 'Please'?",
        "choices": ["Use dominant hand", "Sign counterclockwise", "Repeat the sign", "Use appropriate facial expressions"],
        "answer_index": [1],
        "if_multiple_choice": "true",
        "images" : [],
        "correct_response": "Good job! The sign for 'please' should be done counterclockwise.",
        "wrong_response": "Oops! The most important part of signing please is to sign counterclockwise, to correctly say please."
    },
    8 : {
        "id": "8",
        "question": "Which of the following words/phrases matches the sign below? Choose all that apply.",
        "choices": ["Hello", "Nice to meet you", "Goodbye", "How are you?"],
        "answer_index": [2],
        "if_multiple_choice": "true",
        "images" : ["https://o.quizlet.com/o5GUae5t8-3ZrflI6QxO5A.png"],
        "correct_response": "Good job! This sign means goodbye.",
        "wrong_response": "Oops! This sign means goodbye (not to be confused with hello)."
    },
}

quiz_results_text = {
    1:"Awesome job, you're really getting the hang of this! Do you want to level up and learn harder ASL signs? Check out these courses at: https://www.tlcdeaf.org/services/community-asl-classes"
    ,
    2: "Good effort! A good way to improve your score would be to review the material again and try making signs as you progress!"
    
}

phrases_quiz_questions = {
    1: {
        "id": "1",
        "image": "https://res.cloudinary.com/spiralyze/image/upload/f_auto,w_auto/BabySignLanguage/DictionaryPages/bathroom.svg",
        "answers": ["bathroom", "toilet"]
    },
    2: {
        "id": "2",
        "image": "https://res.cloudinary.com/spiralyze/image/upload/f_auto,w_auto/BabySignLanguage/DictionaryPages/excuse_me.svg",
        "answers": ["excuse me", "excuse"]
    },
    3: {
        "id": "3",
        "image": "https://res.cloudinary.com/spiralyze/image/upload/f_auto,w_auto/BabySignLanguage/DictionaryPages/thank_you.svg",
        "answers": ["thank you", "thanks"]
    }
}

greetings_quiz_questions = {
    1: {
        "id": 1,
        "image": "https://res.cloudinary.com/spiralyze/image/upload/f_auto,w_auto/BabySignLanguage/DictionaryPages/goodbye.svg",
        "answers": ["goodbye", "bye"] 
    },
    2: {
        "id": 2,
        "image": "https://o.quizlet.com/RvOsMQy.mazGui2N1rnI6A.jpg",
        "answers": ["nice to meet you"] 
    },
    3: {
        "id": 3,
        "image": "https://res.cloudinary.com/spiralyze/image/upload/f_auto,w_auto/BabySignLanguage/DictionaryPages/hello.svg",
        "answers": ["hello", "hi"] 
    },

}

# ROUTES

viewed_greetings = []
viewed_phrases = []


@app.route('/')
def home():
    # Selecting specific items to feature on the home page. Adjust the selection logic as needed.
    featured_items = [data[1], data[2], data[3]]  # Example: using the last two items for display
    return render_template('home.html', featured_items=featured_items)

@app.route('/greetings', methods=['GET', 'POST'])
def greetings():
#     if request.method == 'POST':
#         session['completed_greetings'] = True
#         flash('Greetings section completed!', 'success')
#         return redirect(url_for('home'))

    go_go = data[0:5]
    return render_template('greetings.html', go_go=go_go)

@app.route('/greetings_page', methods=['GET', 'POST'])
def greetings_page():
#     if request.method == 'POST':
#         session['completed_greetings'] = True
#         flash('Greetings section completed!', 'success')
#         return redirect(url_for('greetings'))  # Assuming you want to stay on/still show the greetings page
    go_go = data[0:5]
    return render_template('greetings.html', go_go=go_go)




@app.route('/phrases', methods=['GET', 'POST'])
def phrases():
#     if request.method == 'POST':
#         session['completed_phrases'] = True
#         flash('Phrases section completed!', 'success')
#         return redirect(url_for('home'))

    popular_items = data[5:]
    return render_template('helpful_phrases.html', popular_items=popular_items)


@app.route('/phrases_page', methods=['GET', 'POST'])
def phrases_page():
#     if request.method == 'POST':
#         session['completed_phrases'] = True
#         flash('Phrases section completed!', 'success')
#         return redirect(url_for('phrases'))  # Assuming you want to redirect back to the phrases overview page
    popular_items = data[5:]
    return render_template('helpful_phrases.html', popular_items=popular_items)


@app.route('/quiz', methods=['GET'])
def quiz():
    if len(viewed_greetings) + len(viewed_phrases) < 11:
        flash('Please complete all required sections before starting the quiz.', 'error')
        return redirect(url_for('home'))

    session['score'] = 0
    session['current_question_id'] = 1
    return redirect(url_for('quiz_question', id=session['current_question_id']))




#intermiediate quiz route fro greetings
@app.route('/greetings_quiz', methods=['GET', 'POST'])
def greetings_quiz():
    # Check if the necessary sections have been completed
    return render_template('greetings_quiz.html', questions=greetings_quiz_questions)

#intermiediate quiz route for phrases
@app.route('/phrases_quiz', methods=['GET', 'POST'])
def phrases_quiz():
    return render_template('phrases_quiz.html', questions=phrases_quiz_questions)


#test route
@app.route('/start_quiz', methods=['GET'])
def start_quiz():
    # Check if the necessary sections have been completed
    # print(session.get('completed_phrases'))
    # if not session.get('completed_greetings') or not session.get('completed_phrases'):

    if len(viewed_greetings) + len(viewed_phrases) < 11:
        flash('Please complete all required sections before starting the quiz.', 'error')
        return redirect(url_for('home'))
    else:
        return render_template('start_quiz.html')



@app.route('/quiz/<int:id>', methods=['GET', 'POST'])
def quiz_question(id):
    #added the first if as a test
    if 'current_question_id' not in session:
        flash('Please start the quiz from the beginning.', 'error')
        return redirect(url_for('quiz'))

    if id != session.get('current_question_id'):
        return redirect(url_for('quiz_question', id=session['current_question_id']))

    question = quiz_questions.get(id)
    if not question:
        return "Question not found", 404

    if request.method == 'POST':
        submitted_answer = request.get_json().get('answer', [])
        if not isinstance(submitted_answer, list):
                    submitted_answer = [submitted_answer]
        is_correct = set(submitted_answer) == set(question['answer_index'])
        
        if is_correct:
            session['score'] += 1
        session['current_question_id'] += 1

        feedback = question['correct_response'] if is_correct else question['wrong_response']
        response_data = {
            'is_correct': is_correct,
            'feedback': feedback,
            'next_question_id': session['current_question_id'] if session['current_question_id'] <= len(quiz_questions) else None
        }
        return jsonify(response_data)

    return render_template('quiz.html', question=question, question_num=id)




@app.route('/quiz_results', methods=['GET'])
def quiz_results():
    if session.get('current_question_id') - 1 != len(quiz_questions):
        return redirect(url_for('quiz_question', id=session['current_question_id']))

    score = session.get('score', 0)
    total_questions = len(quiz_questions)
    session.pop('score', None) 
    session.pop('current_question_id', None)

    results_text = quiz_results_text[1] if score == total_questions else quiz_results_text[2]
    return render_template('quiz_results.html', score=score, total_questions=total_questions, results_text=results_text)

    
    
@app.template_filter('youtube_id')
def youtube_id_filter(s):
    """Extracts the video ID from a YouTube URL."""
    query = urlparse(s)
    if query.hostname == 'youtu.be':
        return query.path[1:]
    if query.hostname in ('www.youtube.com', 'youtube.com'):
        if query.path == '/watch':
            p = parse_qs(query.query)
            return p['v'][0]
        if query.path[:7] == '/embed/':
            return query.path.split('/')[2]
        if query.path[:3] == '/v/':
            return query.path.split('/')[2]
    # return an empty string if the URL does not seem to be a YouTube URL
    return ''

# Define the length filter
@app.template_filter('length')
def length_filter(s):
    return len(s)

# Make sure the filter is registered
app.jinja_env.filters['length'] = length_filter

@app.route('/view/<int:id>')
def view_item(id):
    item = next((item for item in data if item["id"] == str(id)), None)
    if item:
        index = data.index(item)
        data_length = len(data)  # Total length of the data
        category = "greetings" if index < 5 else "phrases"
        
        if index < 5 and index not in viewed_greetings:
            viewed_greetings.append(index)
        if index >= 5 and index not in viewed_phrases:
            viewed_phrases.append(index)

        # Calculate next_id with wrapping
        if category == "greetings" and index == 4:
            next_id = data[5]["id"]  # First item of the phrases section
        elif category == "phrases" and index == data_length - 1:
            next_id = data[0]["id"]  # Wrap around to the first item of greetings
        else:
            next_id = data[index + 1]["id"]  # Next item in the current category

        # Calculate prev_id with wrapping
        if category == "greetings" and index == 0:
            prev_id = data[data_length - 1]["id"]  # Last item of the phrases section
        elif category == "phrases" and index == 5:
            prev_id = data[4]["id"]  # Last item of the greetings section
        else:
            prev_id = data[index - 1]["id"]  # Previous item in the current category

        return render_template('view_item.html', item=item, index=index, data_length=data_length, category=category, next_id=next_id, prev_id=prev_id)
    else:
        return "Item not found", 404


@app.context_processor
def inject_session_id():
    return {'session_id': session_id}


if __name__ == '__main__':
    app.run(debug=True, port=5008)
