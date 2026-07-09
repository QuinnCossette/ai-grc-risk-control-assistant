const controls = [
  {
    id: "AC-01",
    name: "Privileged Access Review",
    domain: "Identity and Access",
    owner: "Security Operations",
    frameworks: ["NIST CSF", "SOC 2", "ISO 27001"],
    maturity: 82,
    status: "Operating",
    summary: "Quarterly review of privileged users, stale roles, and termination alignment."
  },
  {
    id: "IR-04",
    name: "Incident Response Testing",
    domain: "Detection and Response",
    owner: "Cyber Defense",
    frameworks: ["NIST CSF", "SOC 2", "CIS Controls"],
    maturity: 66,
    status: "Needs Evidence",
    summary: "Tabletop exercise evidence exists, but lessons-learned tracking is incomplete."
  },
  {
    id: "VM-02",
    name: "Vulnerability Remediation SLA",
    domain: "Vulnerability Management",
    owner: "Infrastructure",
    frameworks: ["NIST CSF", "ISO 27001", "CIS Controls"],
    maturity: 74,
    status: "Operating",
    summary: "Critical vulnerabilities are tracked against SLA with exception approvals."
  },
  {
    id: "TP-03",
    name: "Third-Party Risk Review",
    domain: "Vendor Risk",
    owner: "GRC",
    frameworks: ["SOC 2", "ISO 27001"],
    maturity: 58,
    status: "Gap",
    summary: "Vendor inventory is current, but renewal reviews are inconsistent."
  },
  {
    id: "LG-01",
    name: "Log Retention and Monitoring",
    domain: "Logging and Monitoring",
    owner: "Security Engineering",
    frameworks: ["NIST CSF", "SOC 2", "CIS Controls"],
    maturity: 79,
    status: "Operating",
    summary: "Centralized logs are retained for 365 days with alert coverage for core systems."
  },
  {
    id: "BC-02",
    name: "Backup Restore Validation",
    domain: "Resilience",
    owner: "IT Operations",
    frameworks: ["NIST CSF", "ISO 27001"],
    maturity: 63,
    status: "Needs Evidence",
    summary: "Restore jobs are scheduled, but validation screenshots are missing for two systems."
  }
];

const risks = [
  {
    id: "R-001",
    title: "Delayed access removal for contractors",
    severity: "High",
    likelihood: "Medium",
    owner: "IAM Lead",
    control: "AC-01",
    treatment: "Automate HR termination feed review and add weekly exception report."
  },
  {
    id: "R-002",
    title: "Incomplete vendor reassessment evidence",
    severity: "Medium",
    likelihood: "High",
    owner: "GRC Analyst",
    control: "TP-03",
    treatment: "Require renewal risk questionnaire and contract owner attestation."
  },
  {
    id: "R-003",
    title: "Critical vulnerability exceptions lack business approval",
    severity: "High",
    likelihood: "Medium",
    owner: "Infrastructure Manager",
    control: "VM-02",
    treatment: "Route exception requests through risk acceptance workflow."
  },
  {
    id: "R-004",
    title: "Incident exercise findings are not tracked to closure",
    severity: "Medium",
    likelihood: "Medium",
    owner: "Cyber Defense Lead",
    control: "IR-04",
    treatment: "Add owners, due dates, and closure evidence for tabletop findings."
  },
  {
    id: "R-005",
    title: "Restore tests do not cover customer data stores",
    severity: "Medium",
    likelihood: "Low",
    owner: "IT Operations",
    control: "BC-02",
    treatment: "Expand validation sampling to customer-facing databases."
  }
];

const evidence = [
  {
    name: "Q2 Privileged Access Review",
    control: "AC-01",
    status: "Approved",
    age: 18,
    owner: "Security Operations",
    detail: "Signed review export, exception list, and remediation confirmation stored."
  },
  {
    name: "Incident Tabletop Lessons Learned",
    control: "IR-04",
    status: "Stale",
    age: 146,
    owner: "Cyber Defense",
    detail: "Exercise notes uploaded, but closure evidence has not been refreshed."
  },
  {
    name: "Critical Vulnerability SLA Report",
    control: "VM-02",
    status: "Approved",
    age: 21,
    owner: "Infrastructure",
    detail: "Scanner export includes SLA aging, exception status, and remediation owner."
  },
  {
    name: "Vendor Renewal Risk Reviews",
    control: "TP-03",
    status: "Missing",
    age: 0,
    owner: "GRC",
    detail: "Renewal attestations are missing for three high-risk vendors."
  },
  {
    name: "SIEM Retention Configuration",
    control: "LG-01",
    status: "Approved",
    age: 34,
    owner: "Security Engineering",
    detail: "Retention policy screenshot and alert routing export attached."
  },
  {
    name: "Backup Restore Screenshots",
    control: "BC-02",
    status: "Stale",
    age: 112,
    owner: "IT Operations",
    detail: "Current screenshots cover internal tools only."
  }
];

const state = {
  framework: "all",
  riskSearch: "",
  domain: "all",
  staleOnly: false
};

const views = document.querySelectorAll(".view");
const navItems = document.querySelectorAll(".nav-item");
const frameworkFilter = document.getElementById("frameworkFilter");
const domainFilter = document.getElementById("domainFilter");
const riskSearch = document.getElementById("riskSearch");
const markStale = document.getElementById("markStale");
const generateBrief = document.getElementById("generateBrief");
const analyzeText = document.getElementById("analyzeText");

function filteredControls() {
  return controls.filter((control) => {
    const matchesFramework = state.framework === "all" || control.frameworks.includes(state.framework);
    const matchesDomain = state.domain === "all" || control.domain === state.domain;
    return matchesFramework && matchesDomain;
  });
}

function filteredRisks() {
  const query = state.riskSearch.toLowerCase();
  return risks.filter((risk) => {
    const control = controls.find((item) => item.id === risk.control);
    const matchesFramework = state.framework === "all" || control.frameworks.includes(state.framework);
    const matchesSearch = [risk.id, risk.title, risk.severity, risk.owner, risk.treatment].join(" ").toLowerCase().includes(query);
    return matchesFramework && matchesSearch;
  });
}

function filteredEvidence() {
  return evidence.filter((item) => {
    const control = controls.find((controlItem) => controlItem.id === item.control);
    const matchesFramework = state.framework === "all" || control.frameworks.includes(state.framework);
    const matchesStale = !state.staleOnly || item.status !== "Approved";
    return matchesFramework && matchesStale;
  });
}

function renderMetrics() {
  const currentControls = filteredControls();
  const currentEvidence = filteredEvidence();
  const avgMaturity = Math.round(currentControls.reduce((sum, item) => sum + item.maturity, 0) / currentControls.length || 0);
  const openRisks = filteredRisks().filter((risk) => risk.severity !== "Low").length;
  const staleEvidence = currentEvidence.filter((item) => item.status !== "Approved").length;
  const approved = Math.round((currentEvidence.filter((item) => item.status === "Approved").length / currentEvidence.length) * 100 || 0);
  const metrics = [
    ["Control maturity", `${avgMaturity}%`, "Average operating strength"],
    ["Open risks", openRisks, "Medium and high items"],
    ["Evidence health", `${approved}%`, "Approved artifacts"],
    ["Review queue", staleEvidence, "Missing or stale evidence"]
  ];
  document.getElementById("metrics").innerHTML = metrics.map(([label, value, text]) => `
    <article class="metric-card">
      <span>${label}</span>
      <strong>${value}</strong>
      <p>${text}</p>
    </article>
  `).join("");
}

function renderCoverage() {
  const grouped = filteredControls().reduce((acc, control) => {
    acc[control.domain] = acc[control.domain] || [];
    acc[control.domain].push(control.maturity);
    return acc;
  }, {});
  const rows = Object.entries(grouped).map(([domain, values]) => {
    const score = Math.round(values.reduce((sum, value) => sum + value, 0) / values.length);
    return { domain, score };
  });
  const average = Math.round(rows.reduce((sum, row) => sum + row.score, 0) / rows.length || 0);
  document.getElementById("coverageSummary").textContent = `${average}% average`;
  document.getElementById("coverageChart").innerHTML = rows.map((row) => `
    <div class="bar-row">
      <strong>${row.domain}</strong>
      <div class="bar-track"><div class="bar-fill" style="width: ${row.score}%"></div></div>
      <span>${row.score}%</span>
    </div>
  `).join("");
}

function renderConcerns() {
  const items = [
    ["Contractor offboarding", "One access review shows delayed deprovisioning. Treat as high priority because it links identity risk to audit evidence."],
    ["Vendor renewals", "High-risk vendors need current reassessment artifacts before SOC 2 evidence requests arrive."],
    ["Incident follow-through", "Exercise notes are present, but closure evidence needs owners and due dates."]
  ];
  document.getElementById("concernList").innerHTML = items.map(([title, text]) => `
    <article class="concern">
      <h3>${title}</h3>
      <p>${text}</p>
    </article>
  `).join("");
}

function renderRiskTable() {
  document.getElementById("riskTable").innerHTML = `
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Risk</th>
          <th>Severity</th>
          <th>Owner</th>
          <th>Control</th>
          <th>Treatment</th>
        </tr>
      </thead>
      <tbody>
        ${filteredRisks().map((risk) => `
          <tr>
            <td>${risk.id}</td>
            <td>${risk.title}</td>
            <td class="severity-${risk.severity.toLowerCase()}">${risk.severity}</td>
            <td>${risk.owner}</td>
            <td>${risk.control}</td>
            <td>${risk.treatment}</td>
          </tr>
        `).join("")}
      </tbody>
    </table>
  `;
}

function renderControls() {
  document.getElementById("controlGrid").innerHTML = filteredControls().map((control) => `
    <article class="control-card">
      <div>
        <span>${control.id} | ${control.domain}</span>
        <h3>${control.name}</h3>
      </div>
      <p>${control.summary}</p>
      <div class="control-meta">
        <span class="badge">${control.owner}</span>
        <span class="badge">${control.status}</span>
      </div>
      <div class="maturity">
        <span>${control.maturity}%</span>
        <div class="maturity-track"><div class="maturity-fill" style="width: ${control.maturity}%"></div></div>
      </div>
    </article>
  `).join("");
}

function renderEvidence() {
  document.getElementById("evidenceList").innerHTML = filteredEvidence().map((item) => `
    <article class="evidence-item">
      <div class="evidence-top">
        <div>
          <span>${item.control} | ${item.owner}</span>
          <h3>${item.name}</h3>
        </div>
        <span class="badge ${item.status.toLowerCase()}">${item.status}</span>
      </div>
      <p>${item.detail}</p>
      <span>${item.age ? `${item.age} days old` : "No artifact uploaded"}</span>
    </article>
  `).join("");
}

function renderBrief() {
  const highRiskCount = filteredRisks().filter((risk) => risk.severity === "High").length;
  const missingEvidence = filteredEvidence().filter((item) => item.status !== "Approved").map((item) => item.control);
  document.getElementById("briefOutput").innerHTML = `
    <div>
      <strong>Executive summary</strong>
      <p>${state.framework === "all" ? "The environment" : state.framework} is partially audit-ready with ${highRiskCount} high-priority risk items and ${missingEvidence.length} evidence gaps.</p>
    </div>
    <div>
      <strong>Recommended next action</strong>
      <p>Prioritize ${missingEvidence.slice(0, 2).join(" and ") || "approved controls"} evidence refreshes, then document owner acceptance for any residual risk.</p>
    </div>
    <div>
      <strong>Analyst note</strong>
      <p>Controls with operating maturity under 70% should receive remediation due dates before the next audit planning checkpoint.</p>
    </div>
  `;
}

function analyzeEvidenceText() {
  const text = document.getElementById("evidenceInput").value.toLowerCase();
  const findings = [];
  if (text.includes("terminated") || text.includes("contractor")) {
    findings.push(["Risk indicator", "Potential access removal delay. Map to privileged access review and offboarding controls."]);
  }
  if (text.includes("12 days") || text.includes("active")) {
    findings.push(["Gap", "Evidence suggests account activity exceeded expected removal timing. Request exception approval or remediation proof."]);
  }
  if (text.includes("review") || text.includes("completed")) {
    findings.push(["Control evidence", "The text supports control operation, but the reviewer, date, population, and exception closure should be explicit."]);
  }
  const output = findings.length ? findings : [["Review note", "No obvious gaps detected. Confirm owner, date, system scope, and approval trail."]];
  document.getElementById("assistantOutput").innerHTML = output.map(([label, body]) => `
    <div>
      <strong>${label}</strong>
      <p>${body}</p>
    </div>
  `).join("");
}

function renderDomains() {
  const domains = [...new Set(controls.map((control) => control.domain))];
  domainFilter.innerHTML = `<option value="all">All domains</option>${domains.map((domain) => `<option value="${domain}">${domain}</option>`).join("")}`;
}

function renderAll() {
  renderMetrics();
  renderCoverage();
  renderConcerns();
  renderRiskTable();
  renderControls();
  renderEvidence();
  renderBrief();
}

navItems.forEach((item) => {
  item.addEventListener("click", () => {
    navItems.forEach((nav) => nav.classList.remove("active"));
    views.forEach((view) => view.classList.remove("active"));
    item.classList.add("active");
    document.getElementById(item.dataset.view).classList.add("active");
  });
});

frameworkFilter.addEventListener("change", (event) => {
  state.framework = event.target.value;
  renderAll();
});

domainFilter.addEventListener("change", (event) => {
  state.domain = event.target.value;
  renderAll();
});

riskSearch.addEventListener("input", (event) => {
  state.riskSearch = event.target.value;
  renderRiskTable();
});

markStale.addEventListener("click", () => {
  state.staleOnly = !state.staleOnly;
  markStale.classList.toggle("active", state.staleOnly);
  markStale.textContent = state.staleOnly ? "Show all evidence" : "Show stale only";
  renderEvidence();
});

generateBrief.addEventListener("click", () => {
  navItems.forEach((nav) => nav.classList.toggle("active", nav.dataset.view === "assistant"));
  views.forEach((view) => view.classList.toggle("active", view.id === "assistant"));
  renderBrief();
});

analyzeText.addEventListener("click", analyzeEvidenceText);

renderDomains();
renderAll();
analyzeEvidenceText();
