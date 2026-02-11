const tickerSpinnerEl = document.getElementById("tickerSpinner");
const analyzeBtnOriginalHtml = analyzeBtn.innerHTML;

// update history table and show info of last 30 days of stock 
export function renderHistory(history) {
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
export function renderAnalysis(analysis) {
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

// loading state of spinner
export function setLoadingState(isLoading) {
  if (!analyzeBtn || !tickerSpinnerEl) return;

  if (isLoading) {
    analyzeBtn.disabled = true;
    analyzeBtn.innerText = "Analyzing...";
    tickerSpinnerEl.classList.remove("d-none");
    tickerSpinnerEl.style.display = "block";
  } else {
    analyzeBtn.disabled = false;
    analyzeBtn.innerHTML = analyzeBtnOriginalHtml;
    tickerSpinnerEl.classList.add("d-none");
    tickerSpinnerEl.style.display = "";
  }
}