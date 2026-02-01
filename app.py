from flask import Flask, render_template, jsonify, request
from langchain_openai import ChatOpenAI
from langchain_core.output_parsers import StrOutputParser
from config import APP_ICON, APP_TITLE, DEFAULT_TICKER
from dotenv import load_dotenv
from stock_data import get_stock_data, get_30_day_history
from prompts import beginner_prompt_template
from structured_output import Review

load_dotenv()

app = Flask(__name__)

llm = ChatOpenAI(model="gpt-4o-mini")

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/check-api", methods=["POST"])
def check_api():
    try:
        llm = ChatOpenAI() # default model
        llm.invoke("ping")

        return jsonify({
            "success": True
        })
    
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e) # converting error to string
        })
    
@app.route("/get-data", methods=["POST"])
def get_data():
    data = request.get_json()
    value = data.get("value")

    result = get_stock_data(value)

    history = get_30_day_history(value)

    structured_llm = llm.with_structured_output(Review)

    beginner_prompt = beginner_prompt_template.invoke(result)

    llm_response = structured_llm.invoke(beginner_prompt)

    llm_response_json = llm_response.model_dump()
    
    # parser
    # parser = StrOutputParser()

    # chain = beginner_prompt_template | model | parser

    # llm_response = chain.invoke(result)

    # print(type(llm_response.content))

    return jsonify({
        "stock_data": result,                          # dict
        "analysis": llm_response_json,     # string
        "history": history
    })

    

if __name__ == "__main__":
    app.run(debug=True)

