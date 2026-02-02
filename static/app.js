// check openAI api connection
document.getElementById("checkConnectionBtn").addEventListener("click", async () => {
  const status = document.getElementById("apiStatus");
  status.textContent = "Testing...";

  try {
    const response = await fetch("/check-api", {
      method: "POST"
    });

    const data = await response.json();

    if (data.success) {
      status.textContent = "✅ OpenAI API connected successfully";
    } else {
      status.textContent = "❌ API Error: " + data.error;
    }
  } catch (err) {
    status.textContent = "❌ Server error";
  }
});

// update history table and show info of last 30 days of stock 
function renderHistory(history) {
  const tbody = document.getElementById("historyBody");

  tbody.innerHTML = history.map(r => `
    <tr>
      <td>${r.Date}</td>
      <td>${(r.Open.toFixed(2))}</td>
      <td>${(r.High.toFixed(2))}</td>
      <td>${(r.Low.toFixed(2))}</td>
      <td>${(r.Close.toFixed(2))}</td>
      <td>${(r.Volume.toFixed(2))}</td>
    </tr>
  `).join("");
}

// function used to show structured output of the llm
function renderAnalysis(analysis) {
  // 1. Overview
  document.getElementById("companyOverview").textContent =
    analysis.company_overview;

  // 2. Price vs range
  document.getElementById("rangeAnalysis").textContent =
    analysis.price_vs_52_week_range;

  // 3. Disclaimer
  document.getElementById("disclaimerText").textContent =
    analysis.disclaimer;

  // 4. takeaways
  const takeawaysEl = document.getElementById("takeawaysList");
  takeawaysEl.innerHTML = "";

  analysis.takeaways.forEach(item => {
    const li = document.createElement("li");
    li.textContent = item;
    takeawaysEl.appendChild(li);
  });

  // 5. Concerns
  const concernsEl = document.getElementById("concernsList");
  concernsEl.innerHTML = "";

  analysis.notable_concerns.forEach(item => {
    const li = document.createElement("li");
    li.textContent = item;
    concernsEl.appendChild(li);
  });

  // 6. Metrics table
  const metricsEl = document.getElementById("metricsTable");
  metricsEl.innerHTML = "";

  analysis.key_metrics.forEach(metric => {
    const card = document.createElement("div");
    card.className = "metric-card";

    card.innerHTML = `
      <strong>${metric.name}</strong><br/>
      <span><b>Value:</b> ${metric.value ?? "—"}</span><br/>
      <span><b>What it is:</b> ${metric.explanation}</span><br/>
      <span><b>What it suggests:</b> ${metric.implication}</span>
    `;

    metricsEl.appendChild(card);
  });
}



// get respone from yfinance
document.getElementById("analyzeBtn").addEventListener("click", async () => {
    console.log("button clicked")
    const userInput = document.getElementById("tickerInput").value;

    // user experience level
    const analysisLevel = document.getElementById("analysisLevel").value

    // analysis level that user wants
    const analysisType = document.querySelector('input[name="analysisType"]:checked').value;

    const response = await fetch("/get-data", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        // header is meant to tell Flask that "Hey, I'm sending JSON"

        body: JSON.stringify({
            value: userInput,   // 👈 sent to Flask
            analysis_level: analysisLevel,
            analysis_type: analysisType
        })
    });
    // fetch is a browser function to make http calls. /get-data is the url path to the server

    // await means wait till the server replies. once the server replies its content is stored in the variable respones. 
    

    const data = await response.json();
    document.getElementById("results").classList.remove("hidden");
    console.log(data)

    const stock = data.stock_data
    const analysis = data.analysis
    const history = data.history

    // changing found pill
    document.getElementById("foundName").textContent = stock.name
    document.getElementById("foundSymbol").textContent = userInput

    // changing key metrics by getting results from data
    document.getElementById("mPe").textContent = stock.pe_ratio
    document.getElementById("mHigh").textContent = stock.week_52_high
    document.getElementById("mLow").textContent = stock.week_52_low
    document.getElementById("mMcap").textContent = stock.market_cap
    document.getElementById("mVol").textContent = stock.avg_volume
    document.getElementById("mDiv").textContent = stock.dividend_yield
    document.getElementById("mSector").textContent = stock.sector
    document.getElementById("mPrice").textContent = stock.price
    document.getElementById("mDelta").textContent = stock.change_percent

    console.log(history)
    console.log(analysis)

    // changing html to view last 30 days history of the stock
    renderHistory(history)

    document.getElementById("historyHint").textContent = ""

    // outputing llm respose
    renderAnalysis(analysis)

    // viewing raw data
    document.getElementById("rawJson").textContent = JSON.stringify(stock, null, 2)
});
