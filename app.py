import json
import re
import sys
import os
from dotenv import load_dotenv
from datetime import datetime

import openai
from flask import Flask, jsonify, render_template, request

app = Flask(__name__)

HEADINGS_AMOUNT = 5

openai.api_key = os.getenv("OPENAI_API_KEY")
GRAMMARLY_CLIENT_ID = os.getenv("GRAMMARLY_CLIENT_ID")


@app.route("/")
def index():
    return render_template("index.html", client_id=GRAMMARLY_CLIENT_ID)


@app.route("/api/seo", methods=["POST"])
def write_content():

    user_inputs = request.json
    keyword = user_inputs["keyword"]
    sub_keyword = user_inputs["subKeyword"]
    text_length = user_inputs["textLength"]
    headings = user_inputs["headings"]

    content = generate_content(headings)

    return jsonify(content)


@app.route("/api/headings", methods=["POST"])
def choose_headings():
    user_inputs = request.json
    keyword = user_inputs["keyword"]
    sub_keyword = user_inputs["subKeyword"]
    text_length = user_inputs["textLength"]

    suggested_headings = generate_suggested_headings(keyword, sub_keyword)

    return jsonify(data=suggested_headings)


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


def generate_suggested_headings(keyword, sub_keyword):
    headings = []
    for i in range(HEADINGS_AMOUNT):
        headings_prompt = "Give me ONE cool and unique SEO-compatible H2 heading based on the keyword '{}' and the sub-keyword '{}'".format(
            keyword, sub_keyword)

        response = openai.Completion.create(
            model="text-davinci-003",
            prompt=headings_prompt,
            temperature=0.7,
            max_tokens=500
        )
        heading = response["choices"][0]["text"].replace(
            "\n\n", "", 1).replace('"', '')
        headings.append(heading)

    return (headings)
