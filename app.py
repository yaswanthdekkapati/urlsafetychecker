from flask import Flask, render_template, request, jsonify
import validators
import requests
from urllib.parse import urlparse
import socket
import time
import whois

app = Flask(__name__)


@app.route("/")
def home():
    return render_template("index.html")


@app.route("/check", methods=["POST"])
def check_url():

    data = request.get_json()
    url = data.get("url")

    if not validators.url(url):
        return jsonify({
            "success": False,
            "message": "Invalid URL. Please enter a valid URL."
        })

    try:

        domain = urlparse(url).netloc

        ip_address = socket.gethostbyname(domain)

        start_time = time.time()
        response = requests.get(url, timeout=5)
        end_time = time.time()

        response_time = round((end_time - start_time) * 1000, 2)

        https = "Yes" if url.startswith("https://") else "No"

        # --------------------------
        # WHOIS
        # --------------------------

        info = whois.whois(domain)

        registrar = info.registrar if info.registrar else "Unknown"

        creation = info.creation_date
        expiry = info.expiration_date

        if isinstance(creation, list):
            creation = creation[0]

        if isinstance(expiry, list):
            expiry = expiry[0]

        creation = str(creation) if creation else "Unknown"
        expiry = str(expiry) if expiry else "Unknown"

        # --------------------------
        # Risk Score
        # --------------------------

        risk_score = 100

        if https == "No":
            risk_score -= 20

        if response.status_code != 200:
            risk_score -= 10

        suspicious = [
            ".xyz",
            ".tk",
            ".top",
            ".click",
            ".gq"
        ]

        for tld in suspicious:
            if domain.endswith(tld):
                risk_score -= 30

        if len(domain) > 30:
            risk_score -= 10

        if domain.count("-") >= 2:
            risk_score -= 15

        if "@" in url:
            risk_score -= 5

        if len(url) > 80:
            risk_score -= 10

        risk_score = max(0, min(100, risk_score))

        return jsonify({

            "success": True,

            "domain": domain,

            "ip": ip_address,

            "status": response.status_code,

            "https": https,

            "risk": risk_score,

            "response_time": response_time,

            "registrar": registrar,

            "creation": creation,

            "expiry": expiry

        })

    except Exception as e:

        return jsonify({

            "success": False,

            "message": str(e)

        })


if __name__ == "__main__":
    app.run(debug=True)