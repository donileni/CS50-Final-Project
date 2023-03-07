import re
import sys
from datetime import datetime

import openai
from flask import Flask, jsonify, render_template, request

app = Flask(__name__)
app.run(debug=True)

openai.api_key = ""


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/api/seo", methods=["POST"])
def write_content():

    user_inputs = request.json
    keyword = user_inputs["keyword"]
    sub_keyword = user_inputs["subKeyword"]
    text_length = user_inputs["textLength"]

    headings = generate_headings(keyword, sub_keyword, text_length)
    content = generate_content(headings)

    return jsonify(content)


def generate_headings(keyword, sub_keyword, text_length):

    number_of_headings = 0

    if text_length == "500":
        number_of_headings = 2
    elif text_length == "1000":
        number_of_headings = 4
    elif text_length == "1500":
        number_of_headings = 6
    else:
        number_of_headings = 8

    headings_prompt = "Generate {} SEO-compatible headings appertaining to the main keyword '{}' and the sub-keyword '{}'. Return a comma-seperated list.".format(
        number_of_headings, keyword, sub_keyword)

    response = openai.Completion.create(
        model="text-davinci-003",
        prompt=headings_prompt,
        temperature=0.6,
        max_tokens=500
    )

    headings = response["choices"][0]["text"]
    return headings.split(",")


def create_prompts(headings):
    prompts = []
    for heading in headings:
        prompts.append(
            "Write an SEO-optimized section of more than 200 words but less than 300 words for the heading '{}'. Return the response in an HTML format and include the heading as an 'H2' at the top. Each paragraph should be in a <p> tag".format(heading))
    return prompts


def generate_section(prompt):
    response = openai.Completion.create(
        model="text-davinci-003",
        prompt=prompt,
        temperature=0.6,
        max_tokens=4000
    )

    answer = response["choices"][0]["text"]

    return answer


def generate_content(headings):
    prompts = create_prompts(headings)
    i = 0
    sections = []

    for prompt in prompts:
        sections.append(
            {"heading": headings[i], "section": generate_section(prompt)})
        i += 1

    return sections
