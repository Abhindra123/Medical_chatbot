
from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import csv
import random
import requests
import string
import os
import nltk
from textblob import TextBlob
import spacy
import transformers
from transformers import pipeline

app = Flask(__name__)
CORS(app, supports_credentials=True)
'''
df = pd.read_csv('./medicals.csv')
def chatbot(user_input):
    response = ''
    if user_input.lower() == 'hi':
        response = random.choice(['Hi there!', 'Hello!', 'Good morning!', 'Hey!']) + ' I\'m a medical chatbot. How can I assist you today?'
    else:
        # find the matching disease in the dataset
        match = df[df['DISEASE'] == user_input]
        #if match.empty:
        #response = 'Sorry, I don\'t have any information on that disease.'
        #else:
            # ask the user some questions before providing prevention information
            #response = 'Before I provide information on {} prevention, I have a few questions for you:\n'.format(match.iloc[0]['DISEASENAME'])
           
            # severity = request.form.get('severity')
            # past_symptoms = request.form.get('past_symptoms')
            # medical_conditions = request.form.get('medical_conditions')
            # medications = request.form.get('medications')
            # allergies = request.form.get('allergies')
            # recent_travel = request.form.get('recent_travel')
            
            # ask the user what they want to know about the disease
        choice = request.form.get('choice')
        if choice.lower() == 'prevention':
            response += match.iloc[0]['PREVENTION']
        elif choice.lower() == 'home remedies':
            response += match.iloc[0]['HOME REMEDIES']
        elif choice.lower() == 'medicine':
            response += match.iloc[0]['MEDICINE']
        else:
            response += 'Sorry, I didn\'t understand that.'
    return response

'''

import openai
openai.api_key = "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"
model_engine = "text-davinci-002"

def medical_chatbot(user_input):
    prompt = f"User: {user_input}\nBot:"
    response = openai.Completion.create(
        engine=model_engine,
        prompt=prompt,
        max_tokens=1024,
        n=1,
        stop=None,
        temperature=0.5,
    )
    bot_response = response.choices[0].text.strip()
    return bot_response




def find_nearby_hospital(latitude, longitude):
    # Define the API endpoint
    url = "https://maps.googleapis.com/maps/api/place/nearbysearch/json"
    
    # Define the search parameters
    params = {
        "location": f"{latitude},{longitude}",
        "radius": 10000,  # Search radius in meters
        "type": "hospital",
        "key": "AIzaSyAzZfEBgRi40tWHJUZ_kXJOM-__i1zz0eY"
    }
    
    # Send the HTTP request to the API endpoint
    response = requests.get(url, params=params)
    
    # Parse the JSON response
    results = response.json().get("results", [])
    
    if len(results) > 0:
        # Get the first result, which is the nearest hospital
        nearest_hospital = results[0]
        
        # Extract the name, address, and phone number
        name = nearest_hospital.get("name", "Unknown")
        address = nearest_hospital.get("vicinity", "Unknown")
        phone_number = nearest_hospital.get("formatted_phone_number", "Not available")
        
        # Build the output string
        output = f"Name: {name}\nAddress: {address}\nPhone number: {phone_number}"
    else:
        output = "No hospitals found within 5000 meters."
    
    return output

@app.route('/loc',methods=['POST'])
def loca():
    lat=request.json['lat']
    lon=request.json['lon']
    print(lat)
    fet=find_nearby_hospital(lat,lon)
    res=jsonify(fet)
    return res

@app.route('/chatbot', methods=['POST'])
def chat_bot():
    user_input = request.json['userInput']
    print(user_input)
    ans=medical_chatbot(user_input)
   # bot_response = chatbot(user_input)
    response = jsonify(ans)
    return response



if __name__ == '__main__':
    app.run()