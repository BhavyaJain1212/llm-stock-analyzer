import { renderAnalysis, renderHistory, setLoadingState } from "./functions.js";

// get response from yfinance + handle spinner / button state
const analyzeBtn = document.getElementById("analyzeBtn");
const tickerInputEl = document.getElementById("tickerInput");

analyzeBtn.addEventListener("click", async () => {
  const userInput = tickerInputEl.value.trim();
  if (!userInput) {
    tickerInputEl.focus();
    return;
  }

  const analysisLevel = document.getElementById("analysisLevel").value;
  const analysisType = document.querySelector('input[name="analysisType"]:checked').value;

  try {
    setLoadingState(true);

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

    // await means wait till the server replies. once the server replies its content is stored in the variable respones. 

    const data = await response.json();

    if (!response.ok) {
      const message = data.message;
      throw new Error(message);
    }

    // hiding alert section and showing result section
    document.getElementById("messageArea").classList.add("d-none");
    document.getElementById("results").classList.remove("d-none");

    // printing data to console
    console.log(data);

    // get stock, analysis, and history data
    const stock = data.stock_data;
    const analysis = data.analysis;
    const history = data.history;

    // changin analysis level and type
    document.getElementById("chipLevel").textContent = `Level: ${analysisLevel}`
    document.getElementById("chipType").textContent = `Type: ${analysisType}`

    // changing found pill
    document.getElementById("foundName").textContent = stock.name;
    document.getElementById("foundSymbol").textContent = userInput;

    // changing key metrics by getting results from data
    document.getElementById("mPe").textContent = stock.pe_ratio;
    document.getElementById("mHigh").textContent = stock.week_52_high;
    document.getElementById("mLow").textContent = stock.week_52_low;
    document.getElementById("mMcap").textContent = stock.market_cap;
    document.getElementById("mVol").textContent = stock.avg_volume;
    document.getElementById("mDiv").textContent = stock.dividend_yield;
    document.getElementById("mSector").textContent = stock.sector;
    document.getElementById("mPrice").textContent = stock.price;
    document.getElementById("mDelta").textContent = stock.change_percent;

    // outputing history and analysis to console. 
    console.log(history);
    console.log(analysis);

    // changing html to view last 30 days history of the stock
    renderHistory(history);

    document.getElementById("historyHint").textContent = "";

    // outputting llm respose
    renderAnalysis(analysis);

    // viewing raw data
    document.getElementById("rawJson").textContent = JSON.stringify(stock, null, 2);

  } catch (err) {
    console.error(err);

    const messageArea = document.getElementById("messageArea");

    // hiding result section and showing alert section
    messageArea.classList.remove('d-none')
    document.getElementById("results").classList.add("d-none");
    
    // adding alert card
    if (messageArea) {
      messageArea.innerHTML = `
        <div class="alert alert-danger" role="alert">
          ${err.message}
        </div>
      `;
    }
  } finally {
    setLoadingState(false);
  }
});
