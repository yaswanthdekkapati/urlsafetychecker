Try AI directly in your favorite apps … Use Gemini to generate drafts and refine content, plus get Gemini Pro with access to Google's next-gen AI for ₹1,950 ₹489 for 3 months
script.js
1
100%
const button = document.getElementById("checkButton");

button.addEventListener("click", async function () {

    const url = document.getElementById("urlInput").value.trim();

    if (url === "") {
        alert("Please enter a URL");
        return;
    }

    const response = await fetch("/check", {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({
            url: url
        })

    });

    const data = await response.json();

    if (data.success) {

        let riskColor = "#16a34a";
        let badge = "🟢 SAFE";

        if (data.risk < 80) {
            riskColor = "#f59e0b";
            badge = "🟡 SUSPICIOUS";
        }

        if (data.risk < 50) {
            riskColor = "#dc2626";
            badge = "🔴 DANGEROUS";
        }

        document.getElementById("result").innerHTML = `

        <h2 class="analysis-title">🔍 URL Analysis</h2>

        <p class="analysis-item">
        <strong>🌐 Domain:</strong> ${data.domain}
        </p>

        <p class="analysis-item">
        <strong>🌍 IP Address:</strong> ${data.ip}
        </p>

        <p class="analysis-item">
        <strong>🔒 HTTPS:</strong> ${data.https}
        </p>

        <p class="analysis-item">
        <strong>📡 Status Code:</strong> ${data.status}
        </p>

        <p class="analysis-item">
        <strong>⏱ Response Time:</strong> ${data.response_time} ms
        </p>
        <p class="analysis-item">
        <strong>🏢 Registrar:</strong>
        ${data.registrar}
        </p>

        <p class="analysis-item">
        <strong>📅 Created:</strong>
         ${data.creation}
        </p>

        <p class="analysis-item">
        <strong>📆 Expiry:</strong>
        ${data.expiry}
        </p>

        <div class="badge" style="background:${riskColor};">
            ${badge}
        </div>

        <div class="progress">

            <div
            class="progress-bar"
            style="width:${data.risk}%; background:${riskColor};">

                ${data.risk}%

            </div>

        </div>

        `;

    } else {

        document.getElementById("result").innerHTML = `

        <h3 style="color:red;">
        ❌ ${data.message}
        </h3>

        `;

    }

});
