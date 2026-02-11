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
    // Give the browser time to paint the spinner before we block on fetch
    await new Promise((r) => setTimeout(r, 50));

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
    
    if (!response.ok) {
      throw new Error("Request failed with status " + response.status);
    }

    const data = await response.json();
    document.getElementById("results").classList.remove("d-none");
    console.log(data);

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
    if (messageArea) {
      messageArea.innerHTML = `
        <div class="alert error">
          There was an error loading the analysis. Please try again.
        </div>
      `;
    }
  } finally {
    setLoadingState(false);
  }
});
