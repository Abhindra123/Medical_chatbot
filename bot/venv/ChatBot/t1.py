import pandas as pd
file_path = './medico.csv'
df = pd.read_csv(file_path)

import csv
import random
import string
import nltk
from textblob import TextBlob
import spacy
import transformers
from transformers import pipeline

def load_csv(filename, encoding='utf-8'):
    with open(filename, "r", encoding=encoding) as file:
        reader = csv.reader(file)
        data = list(reader)
    return data


def sentiment_analysis(text):
    blob = TextBlob(text)
    sentiment = blob.sentiment.polarity
    if sentiment > 0:
        return "positive"
    elif sentiment < 0:
        return "negative"
    else:
        return "neutral"

def entity_recognition(text):
    nlp = spacy.load('en_core_web_sm')
    doc = nlp(text)
    entities = []
    for ent in doc.ents:
        entities.append(ent.text)
    return entities

def intent_classification(text):
    model_name = "dslim/bert-base-NER"
    classifier = pipeline("ner", model=model_name)
    result = classifier(text)
    labels = [r['entity'] for r in result]
    intent_label = "diagnosis" if "SYMPTOM" in labels else "unknown"
    return intent_label

def chatbot(csv_file):
    # Load data
    data = load_csv(csv_file)

    print("Welcome to the medical diagnosis chatbot. How can I help you today?")
    while True:
        # Get user input
        user_input = input("> ")
        # Preprocess user input
        preprocessed_input = preprocess(user_input)
        # Perform sentiment analysis on preprocessed input
        sentiment = sentiment_analysis(preprocessed_input)
        # Perform entity recognition on preprocessed input
        entities = entity_recognition(preprocessed_input)
        # Perform intent classification on preprocessed input
        intent = intent_classification(preprocessed_input)
        # Generate response based on intent
        if intent == "diagnosis":
            # Search for matching symptoms in data
            matches = [row[1] for row in data if all(s in preprocessed_input for s in row[0].split())]
            # If matches are found, select a random diagnosis from the matches
            if matches:
                response = f"Based on your symptoms ({', '.join(entities)}), you may have {random.choice(matches)}."
            else:
                response = "I'm sorry, I'm not sure what you're referring to. Please provide more information."
        else:
            response = "I'm sorry, I'm not sure what you're referring to. Please provide more information."
        print(response)

import nltk
nltk.data.path.append("./nltk_data/")

import csv
import random

def load_csv(csv_file):
    data = []
    with open(csv_file, "r") as f:
        reader = csv.reader(f)
        for row in reader:
            data.append(row)
    return data

import nltk


# define the symptoms and their corresponding treatments
symptoms = {
    'hypertension': 'Lisinopril',
    'diabetes': 'Metformin',
    'asthma': 'Albuterol',
    'migraine': 'Sumatriptan',
    'high cholesterol': 'Atorvastatin',
    'gerd': 'Omeprazole',
    'depression': 'Escitalopram',
    'arthritis': 'Celecoxib',
    'urinary tract infection': 'Ciprofloxacin',
    'allergies': 'Loratadine',
    'psoriasis': 'Methotrexate',
    'osteoporosis': 'Alendronate',
    'heart failure': 'Furosemide',
    'chronic bronchitis': 'Tiotropium',
    'gastritis': 'Ranitidine',
    'multiple sclerosis': 'Interferon beta-1a',
    'parkinson\'s disease': 'Levodopa-Carbidopa',
    'bipolar disorder': 'Lithium carbonate',
    'glaucoma': 'Timolol',
    'acne': 'Tretinoin (Topical Retinoids)'
}

# define the keywords to look for in user input
keywords = ['suffering', 'having', 'experiencing', 'feeling', 'symptom', 'symptoms', 'problem', 'issue']

# define the function to respond to user input
def respond(input_text):
    # tokenize the input text
    words = nltk.word_tokenize(input_text.lower())
    # check if any of the keywords are in the input text
    if any(word in keywords for word in words):
        # find the corresponding symptom and treatment
        for symptom, treatment in symptoms.items():
            if symptom in input_text.lower():
                response = f"If you have {symptom}, the diagnosis may be {treatment}."
                return response
    else:
        return "I'm sorry, I'm not sure what you're referring to. Please provide more information."

# example usage
print("Welcome to the medical diagnosis chatbot. How can I help you today?")
while True:
    user_input = input("> ")
    response = respond(user_input)
    print(response)

def chatbot(csv_file):
    # Load data
    data = load_csv(csv_file)

    print("Welcome to the medical diagnosis chatbot. How can I help you today?")
    while True:
        # Get user input
        user_input = input("> ")
        # Preprocess user input
        preprocessed_input = preprocess(user_input)
        # Perform sentiment analysis on preprocessed input
        sentiment = sentiment_analysis(preprocessed_input)
        # Perform entity recognition on preprocessed input
        entities = entity_recognition(preprocessed_input)
        # Perform intent classification on preprocessed input
        intent = intent_classification(preprocessed_input)
        # Generate response based on intent
        if intent == "diagnosis":
            # Search for matching symptoms in data
            matches = [row[1] for row in data if all(s in preprocessed_input for s in row[0].split())]
            # If matches are found, select a random diagnosis from the matches
            if matches:
                response = f"Based on your symptoms ({', '.join(entities)}), you may have {random.choice(matches)}."
            else:
                response = "I'm sorry, I'm not sure what you're referring to. Please provide more information."
        elif sentiment == "positive":
            response = "I'm glad to hear that. Is there anything else I can help you with?"
        elif sentiment == "negative":
            response = "I'm sorry to hear that. Can you tell me more about what's been bothering you?"
        else:
            response = "I'm sorry, I'm not sure what you're referring to. Please provide more information."
        print(response)


# Start chatbot
csv_file = './medico.csv'
chatbot(csv_file)
