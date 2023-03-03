import re
import sys
from datetime import datetime

import openai
from flask import Flask, jsonify, render_template, request

app = Flask(__name__)
app.run(debug=True)

openai.api_key = "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"


# @app.route("/")
# def home():
#     response = openai.Completion.create(
#         model="text-davinci-003",
#         prompt="write a short text about APIs",
#         temperature=0.6,
#         max_tokens=500
#     )
#     print(response, file=sys.stderr)
#     print(response.choices[0].text)
#     return response["choices"][0]["text"]

@app.route("/")
def index():
    return render_template("index.html")


@app.route("/api/seo", methods=["POST"])
def write_content():

    user_inputs = request.json
    keyword = user_inputs["keyword"]
    sub_keyword = user_inputs["subKeyword"]
    text_length = user_inputs["textLength"]

    prompt = create_prompt(keyword, sub_keyword, text_length)
    return jsonify(text=prompt)

    response = openai.Completion.create(
        model="text-davinci-003",
        prompt=prompt,
        temperature=0.6,
        max_tokens=4000
    )

    answer = response["choices"][0]["text"]
    content = jsonify(text=answer)

    return content


def create_prompt(keyword, sub_keyword, text_length):
    prompt = "Create a SEO-compatible text with the keyword: '{}' and the sub-keyword: '{}'. The text should be approximately {} words in length".format(
        keyword, sub_keyword, text_length)

    return prompt
    # {
    #   "choices": [
    #     {
    #       "finish_reason": "stop",
    #       "index": 0,
    #       "logprobs": null,
    #       "text": "\n\n4"
    #     }
    #   ],
    #   "created": 1677786161,
    #   "id": "cmpl-6pj73Tj4ywTwMLcNaMy2CMXQTC52X",
    #   "model": "text-davinci-003",
    #   "object": "text_completion",
    #   "usage": {
    #     "completion_tokens": 3,
    #     "prompt_tokens": 6,
    #     "total_tokens": 9
    #   }
    # }
