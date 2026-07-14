const checklistSource = Array.isArray(globalThis.vendorRiskChecklist) ? globalThis.vendorRiskChecklist : [];
const pdfjsLib = globalThis.pdfjsLib;

const contextRules = {
  student: ['ferpa', 'student record', 'student records', 'education record', 'education records'],
  phi: ['hipaa', 'phi', 'protected health information', 'business associate'],
  pci: ['pci', 'payment card', 'cardholder data'],
  glba: ['glba', 'financial aid', 'non-public information'],
  research: ['research data', 'controlled unclassified', 'cui', 'fisma'],
  critical: ['multi-factor', 'multifactor', 'mfa', 'single sign-on', 'sso', 'disaster recovery', 'business continuity']
};

const checklistRules = [
  [['pci', 'payment card'], ['pci', 'payment card', 'cardholder data', 'pci dss']],
  [['hipaa', 'hitech', 'protected health'], ['hipaa', 'phi', 'protected health information', 'business associate', 'baa', 'hitech']],
  [['ferpa', 'educational rights', 'education record', 'education records'], ['ferpa', 'education record', 'education records', 'student record', 'student records']],
  [['glba', 'gramm leach', 'financial aid'], ['glba', 'financial aid', 'non-public information', 'customer information']],
  [['gdpr', 'european union'], ['gdpr', 'european union', 'personal data', 'data subject']],
  [['mgdpa', 'government data'], ['mgdpa', 'government data practices', 'private data', 'nonpublic data']],
  [['fisma', 'controlled unclassified', 'cui'], ['fisma', 'cui', 'controlled unclassified information', 'federal information']],
  [['soc audit', 'soc'], ['soc 2', 'service auditor', 'trust services criteria', 'independent service auditor']],
  [['exception', 'deviation'], ['exception', 'deviation', 'qualified opinion', 'not operating effectively', 'deficiency']],
  [['complementary user', 'cuec'], ['complementary user entity control', 'cuec', 'user entity controls']],
  [['iso'], ['iso 27001', 'iso certification', 'iso/iec']],
  [['independent audit', 'independent audits', 'external audit', 'external audits'], ['independent audit', 'independent audits', 'external audit', 'external audits', 'service auditor', 'third party audit']],
  [['remediation', 'remediate'], ['remediation', 'remediate', 'corrective action', 'management response']],
  [['internal audit'], ['internal audit', 'internal auditing', 'monitoring activities']],
  [['risk assessment'], ['risk assessment', 'risk management', 'risk register']],
  [['architecture', 'data flow'], ['architecture', 'data flow', 'system description', 'network diagram']],
  [['third parties', 'sub processors', 'sub-processors', '4th parties'], ['subservice organization', 'sub-processor', 'third party', 'vendor management', 'carve-out']],
  [['breach', 'confidentiality'], ['breach notification', 'confidentiality', 'security incident']],
  [['information security policy'], ['information security policy', 'security policy']],
  [['acceptable use'], ['acceptable use']],
  [['incident response'], ['incident response', 'security incident', 'breach notification']],
  [['privacy policy'], ['privacy policy', 'privacy notice', 'personal information']],
  [['sdlc'], ['sdlc', 'software development life cycle', 'secure development']],
  [['change management'], ['change management', 'change approval', 'production changes', 'emergency change']],
  [['mobile', 'byod', 'mdm'], ['mobile device', 'byod', 'mdm']],
  [['nda', 'non-disclosure'], ['confidentiality agreement', 'nda', 'non-disclosure']],
  [['background'], ['background check', 'background screening']],
  [['training', 'awareness'], ['security awareness', 'annual training', 'new hire training']],
  [['physical security'], ['physical security', 'badge', 'data center', 'facility access']],
  [['data center'], ['data center', 'hosting', 'cloud hosting', 'availability zone']],
  [['authentication'], ['authentication', 'login', 'identity provider']],
  [['provisioning'], ['provisioning', 'scim', 'user provisioning']],
  [['deprovisioning', 'termination'], ['deprovisioning', 'terminated user', 'access removal', 'employee termination']],
  [['customer data'], ['customer data', 'customer information', 'access to customer']],
  [['access review'], ['access review', 'user access review', 'privileged access review']],
  [['password'], ['password', 'credential']],
  [['complexity'], ['password complexity', 'minimum length']],
  [['expiration'], ['password expiration', 'password rotation']],
  [['reset'], ['password reset', 'account recovery']],
  [['session'], ['session timeout', 'reauthentication', 're-authentication']],
  [['mfa', 'multi-factor'], ['mfa', 'multi-factor', 'multifactor']],
  [['sso', 'single sign-on'], ['sso', 'single sign-on', 'saml']],
  [['log management', 'audit log', 'audit logs', 'logging'], ['log management', 'audit log', 'audit logs', 'logging', 'siem']],
  [['alert'], ['alerting', 'alerts', 'security events']],
  [['splunk'], ['splunk']],
  [['data-at-rest', 'at rest'], ['at rest', 'aes-256', 'encrypted at rest']],
  [['data-in-transit', 'in transit'], ['in transit', 'tls', 'encrypted in transit']],
  [['backup'], ['backup', 'backups', 'restoration test', 'restore']],
  [['ownership'], ['ownership', 'data ownership', 'retain ownership']],
  [['multi-tenant', 'segmentation'], ['multi-tenant', 'segmentation', 'logical separation', 'tenant']],
  [['firewall', 'dmz'], ['firewall', 'dmz', 'network security group']],
  [['business continuity', 'disaster recovery'], ['business continuity', 'disaster recovery', 'bc/dr', 'rto', 'rpo']],
  [['rto', 'rpo'], ['rto', 'rpo', 'recovery time', 'recovery point']],
  [['cloud hosted', 'hosting'], ['cloud hosted', 'hosting', 'cloud provider', 'infrastructure']],
  [['stored in the us', 'data residency'], ['united states', 'us-based', 'data residency', 'stored in the us']],
  [['pen testing', 'penetration'], ['penetration test', 'pen test', 'third party penetration']],
  [['sla'], ['sla', 'service level', 'remediation timeline']],
  [['peer review', 'quality assurance'], ['peer review', 'quality assurance', 'code review']],
  [['vulnerability'], ['vulnerability', 'vulnerability scanning', 'patch']],
  [['sast', 'dast'], ['sast', 'dast', 'static analysis', 'dynamic analysis']],
  [['ids', 'ips', 'intrusion'], ['ids', 'ips', 'intrusion detection', 'intrusion prevention']],
  [['patch'], ['patch management', 'emergency patch', 'patches']],
  [['spf'], ['spf', 'sender policy framework']],
  [['dmarc'], ['dmarc']],
  [['dkim'], ['dkim']],
  [['antivirus', 'malware'], ['antivirus', 'anti-malware', 'malware', 'endpoint protection']],
  [['real-time', 'continuously'], ['real-time', 'continuous', 'continuously']],
  [['vpat', 'accessibility'], ['vpat', 'accessibility']],
  [['removable media'], ['removable media', 'usb']],
  [['responsible ai'], ['responsible ai', 'ai risk framework', 'ai training']],
  [['artificial intelligence', 'machine learning'], ['artificial intelligence', 'ai', 'machine learning', 'ml model']],
  [['litigation'], ['litigation', 'legal proceeding']],
  [['acquisition'], ['acquisition', 'merger', 'change of control']]
];

const state = {
  hasReport: false,
  reportName: '',
  rawText: '',
  pages: [],
  extractedWords: 0,
  findings: [],
  checklistResults: [],
  profile: null,
  context: new Set(),
  domain: 'all',
  status: 'all',
  riskSearch: '',
  showAllEvidence: false
};

const elements = {
  views: document.querySelectorAll('.view'),
  navItems: document.querySelectorAll('.nav-item'),
  metrics: document.getElementById('metrics'),
  coverageSummary: document.getElementById('coverageSummary'),
  coverageChart: document.getElementById('coverageChart'),
  reportProfile: document.getElementById('reportProfile'),
  concernList: document.getElementById('concernList'),
  riskTable: document.getElementById('riskTable'),
  controlGrid: document.getElementById('controlGrid'),
  evidenceList: document.getElementById('evidenceList'),
  briefOutput: document.getElementById('briefOutput'),
  assistantOutput: document.getElementById('assistantOutput'),
  evidenceInput: document.getElementById('evidenceInput'),
  reportUpload: document.getElementById('reportUpload'),
  fileStatus: document.getElementById('fileStatus'),
  reviewStatus: document.getElementById('reviewStatus'),
  analyzeText: document.getElementById('analyzeText'),
  generateBrief: document.getElementById('generateBrief'),
  downloadWorkpaper: document.getElementById('downloadWorkpaper'),
  resetScan: document.getElementById('resetScan'),
  domainFilter: document.getElementById('domainFilter'),
  statusFilter: document.getElementById('statusFilter'),
  riskSearch: document.getElementById('riskSearch'),
  showEvidence: document.getElementById('markStale'),
  extractedTextDetails: document.getElementById('extractedTextDetails'),
  extractedText: document.getElementById('extractedText')
};

if (pdfjsLib) {
  pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
}

function escapeHtml(value) {
  return String(value || '').replace(/[&<>"']/g, function (character) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[character];
  });
}

function displayText(value) {
  return String(value || '')
    .replace(/University of Minnesota/gi, 'your organization')
    .replace(/\bUMN\b/gi, 'organization');
}

function checklistText(value) {
  return displayText(value)
    .replace(/\s*-\s*https?:\/\/\S+$/gim, '')
    .trim();
}

function checklistTitle(value) {
  return checklistText(value)
    .split('\n')[0]
    .trim();
}

function normalizeText(value) {
  return String(value || '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
}

function compactText(value) {
  return String(value || '').replace(/\s+/g, ' ').trim();
}

function words(value) {
  return compactText(value).split(' ').filter(Boolean);
}

function unique(values) {
  return Array.from(new Set(values.filter(Boolean)));
}

function includesAny(text, terms) {
  const lower = String(text || '').toLowerCase();
  return terms.some(function (term) { return findTermIndex(lower, term) !== -1; });
}

function includesNormalizedTerm(text, term) {
  const normalizedText = ' ' + normalizeText(text) + ' ';
  const normalizedTerm = normalizeText(term);
  return normalizedTerm ? normalizedText.includes(' ' + normalizedTerm + ' ') : false;
}

function isAcronym(value) {
  return /^[a-z0-9]{2,5}$/i.test(String(value || '').trim());
}

function escapeRegExp(value) {
  return String(value || '').replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function findTermIndex(text, term) {
  const normalizedTerm = String(term || '').trim().toLowerCase();
  if (!normalizedTerm) {
    return -1;
  }

  // Keep short terms from matching inside unrelated words.
  const escapedTerm = escapeRegExp(normalizedTerm);
  const expression = new RegExp('(^|[^a-z0-9])' + escapedTerm + '(?=[^a-z0-9]|$)', 'i');
  const match = expression.exec(text);
  return match ? match.index + match[1].length : -1;
}

function pluralize(count, singular, plural) {
  return count === 1 ? singular : (plural || singular + 's');
}

function selectedContext() {
  return new Set(Array.from(document.querySelectorAll('input[name="reviewContext"]:checked')).map(function (input) {
    return input.value;
  }));
}

function currentReviewDate() {
  return new Date();
}

function dateLabel(date) {
  return new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: 'numeric' }).format(date);
}

function pageLabel(page) {
  return page ? 'p. ' + page : 'Pasted text';
}

function contextLabel(key) {
  const labels = {
    student: 'FERPA / student records',
    phi: 'HIPAA / PHI',
    pci: 'PCI / payment cards',
    glba: 'GLBA / financial data',
    research: 'research or regulated data',
    critical: 'critical service / SSO'
  };
  return labels[key] || key;
}

function captureExcerpt(text, index, length) {
  const flattened = compactText(text);
  const start = Math.max(0, index - 110);
  const end = Math.min(flattened.length, index + length + 180);
  const prefix = start > 0 ? '...' : '';
  const suffix = end < flattened.length ? '...' : '';
  return prefix + flattened.slice(start, end) + suffix;
}

function findEvidence(terms, pages, limit) {
  const max = limit || 2;
  const evidence = [];
  const seen = new Set();
  const normalizedTerms = unique(terms.map(function (term) { return String(term).toLowerCase(); })).sort(function (a, b) {
    return b.length - a.length;
  });

  (pages || []).some(function (page) {
    const text = compactText(page.text);
    const lower = text.toLowerCase();
    normalizedTerms.forEach(function (term) {
      if (evidence.length >= max) {
        return;
      }
      const index = findTermIndex(lower, term);
      if (index === -1) {
        return;
      }
      const excerpt = captureExcerpt(text, index, term.length);
      const key = String(page.number || 'paste') + ':' + excerpt;
      if (!seen.has(key)) {
        seen.add(key);
        evidence.push({ page: page.number || null, term: term, excerpt: excerpt });
      }
    });
    return evidence.length >= max;
  });

  return evidence;
}

function evidenceHasConcern(evidence) {
  const negative = ['exception', 'deviation', 'deficiency', 'not operating effectively', 'failed', 'not performed', 'qualified opinion', 'adverse opinion'];
  return evidence.some(function (item) {
    const excerpt = item.excerpt.toLowerCase();
    if (!includesAny(excerpt, negative)) {
      return false;
    }
    return !/no (?:control )?(?:exceptions?|deviations?|deficienc(?:y|ies))|without (?:exception|deviation)|no exceptions? noted/.test(excerpt);
  });
}

function relevantTermsForChecklist(item) {
  const normalized = normalizeText(item);
  const matches = [];
  checklistRules.forEach(function (rule) {
    const needles = rule[0];
    const matchedNeedles = needles.filter(function (needle) {
      return includesNormalizedTerm(normalized, needle);
    });
    if (matchedNeedles.length) {
      matches.push({ needles: matchedNeedles, terms: rule[1] });
    }
  });

  const exact = matches.filter(function (match) {
    return match.needles.some(function (needle) {
      return normalized === normalizeText(needle);
    });
  });
  const acronym = matches.filter(function (match) {
    return match.needles.some(isAcronym);
  });
  const selected = exact.length ? exact : acronym.length ? acronym : matches;
  const terms = [];
  selected.forEach(function (match) {
    terms.push.apply(terms, match.terms);
  });

  if (!terms.length) {
    return [];
  }
  return unique(terms);
}

function checklistNeedsContext(entry) {
  const text = normalizeText(entry.domain + ' ' + entry.item);
  return Object.keys(contextRules).filter(function (key) {
    return contextRules[key].some(function (term) { return text.includes(normalizeText(term)); });
  });
}

function isChecklistApplicable(entry, text, context) {
  if (entry.domain !== 'Compliance (as applicable)') {
    return true;
  }
  const needed = checklistNeedsContext(entry);
  if (!needed.length) {
    return true;
  }
  return needed.some(function (key) {
    return context.has(key) || includesAny(text, contextRules[key]);
  });
}

function evidenceSummary(evidence) {
  if (!evidence.length) {
    return 'No clear matching text was found in the report.';
  }
  const pages = unique(evidence.map(function (item) { return pageLabel(item.page); }));
  const terms = unique(evidence.map(function (item) { return item.term; }));
  return 'Found matching text in ' + pages.join(', ') + ' for ' + terms.join(', ') + '. Check the original report before using it.';
}

function evaluateChecklistItem(entry, pages, context) {
  const item = String(entry.item || '').trim();
  if (!item || /^other$/i.test(item)) {
    return Object.assign({}, entry, {
      status: 'Manual',
      score: 'Manual review',
      analysis: 'This item is too open-ended for a simple scan. Check it yourself in the report and vendor materials.',
      evidence: [],
      matchedTerms: []
    });
  }

  const fullText = pages.map(function (page) { return page.text; }).join(' ');
  if (!isChecklistApplicable(entry, fullText, context)) {
    return Object.assign({}, entry, {
      status: 'Not applicable',
      score: 'Check scope',
      analysis: 'This only applies in some situations. It was not selected above and was not obvious in the report, so make sure it is out of scope.',
      evidence: [],
      matchedTerms: []
    });
  }

  // Use the checklist row itself. Broad domain names can match the wrong item.
  const terms = relevantTermsForChecklist(item);
  if (!terms.length) {
    return Object.assign({}, entry, {
      status: 'Manual',
      score: 'Manual review',
      analysis: 'This row does not line up neatly with SOC 2 wording. Check the report and vendor documents directly.',
      evidence: [],
      matchedTerms: []
    });
  }

  const evidence = findEvidence(terms, pages, 2);
  const hasConcern = evidenceHasConcern(evidence) || /exception|remediation|breach|litigation/i.test(item) && evidence.length > 0;
  if (!evidence.length) {
    return Object.assign({}, entry, {
      status: 'Not found',
      score: 'No report evidence',
      analysis: 'The scan did not find a clear match in the SOC 2 text. Ask for support or mark it not applicable after you confirm the vendor scope.',
      evidence: [],
      matchedTerms: []
    });
  }

  if (hasConcern) {
    return Object.assign({}, entry, {
      status: 'Needs review',
      score: 'Review evidence',
      analysis: 'The report talks about this area, but the matched text mentions an exception, fix, breach, or other risk flag. Look at the control testing and management response.',
      evidence: evidence,
      matchedTerms: unique(evidence.map(function (item) { return item.term; }))
    });
  }

  return Object.assign({}, entry, {
    status: 'Satisfactory',
    score: 'Evidence found',
    analysis: evidenceSummary(evidence),
    evidence: evidence,
    matchedTerms: unique(evidence.map(function (item) { return item.term; }))
  });
}

function parseReportDate(value) {
  const parsed = Date.parse(value);
  return Number.isNaN(parsed) ? null : new Date(parsed);
}

function extractPeriodEnd(text) {
  const compact = compactText(text);
  const patterns = [
    /(?:period|year) (?:ended|ending) (?:on )?([A-Z][a-z]+ \d{1,2}, \d{4})/i,
    /(?:report|audit)\s+period\s*:?\s*(?:from\s+)?([A-Z][a-z]+ \d{1,2}, \d{4})\s+(?:to|through)\s+([A-Z][a-z]+ \d{1,2}, \d{4})/i,
    /(?:from|for the period) ([A-Z][a-z]+ \d{1,2}, \d{4}) (?:to|through) ([A-Z][a-z]+ \d{1,2}, \d{4})/i,
    /(\d{4}-\d{2}-\d{2}) (?:to|through) (\d{4}-\d{2}-\d{2})/i
  ];
  for (let index = 0; index < patterns.length; index += 1) {
    const match = compact.match(patterns[index]);
    if (!match) {
      continue;
    }
    const candidate = match[match.length - 1];
    const date = parseReportDate(candidate);
    if (date) {
      return date;
    }
  }
  return null;
}

function daysBetween(later, earlier) {
  return Math.max(0, Math.floor((later.getTime() - earlier.getTime()) / 86400000));
}

function analyzeProfile(rawText, pages) {
  const text = compactText(rawText);
  const lower = text.toLowerCase();
  const socEvidence = findEvidence(['soc 2', 'service organization control', 'trust services criteria', 'trust service criteria'], pages, 2);
  const typeEvidence = findEvidence(['type ii', 'type 2', 'type two'], pages, 2);
  const opinionConcern = findEvidence(['qualified opinion', 'adverse opinion', 'disclaimer of opinion'], pages, 2);
  const positiveOpinion = findEvidence(['in our opinion', 'fairly stated'], pages, 1);
  const scopeEvidence = findEvidence(['system description', 'description of the system', 'system is designed'], pages, 1);
  const criterionEvidence = findEvidence(['security', 'availability', 'confidentiality', 'processing integrity', 'privacy'], pages, 3);
  const periodEnd = extractPeriodEnd(text);
  const ageDays = periodEnd ? daysBetween(currentReviewDate(), periodEnd) : null;
  const hasCUECs = findEvidence(['complementary user entity control', 'cuec', 'user entity controls'], pages, 2);
  const subservice = findEvidence(['subservice organization', 'sub-service organization'], pages, 2);
  const carveOut = findEvidence(['carve-out method', 'carve out method'], pages, 2);
  const exceptionEvidence = findEvidence(['exception', 'deviation', 'deficiency', 'not operating effectively', 'failed'], pages, 3);
  const clearExceptions = exceptionEvidence.filter(function (item) {
    return !/no (?:control )?(?:exceptions?|deviations?|deficienc(?:y|ies))|without (?:exception|deviation)|no exceptions? noted/i.test(item.excerpt);
  });

  return {
    socFit: socEvidence.length >= 1 && criterionEvidence.length >= 1,
    socEvidence: socEvidence,
    typeII: typeEvidence.length >= 1,
    typeEvidence: typeEvidence,
    opinion: opinionConcern.length ? 'Qualified or adverse language found' : positiveOpinion.length ? 'Opinion language found' : 'Needs a check',
    opinionEvidence: opinionConcern.length ? opinionConcern : positiveOpinion,
    scope: scopeEvidence.length ? 'Scope language found' : 'Scope needs confirmation',
    scopeEvidence: scopeEvidence,
    criteria: unique(criterionEvidence.map(function (item) { return item.term; })),
    periodEnd: periodEnd,
    ageDays: ageDays,
    cuecs: hasCUECs,
    subservice: subservice,
    carveOut: carveOut,
    exceptions: clearExceptions
  };
}

function makeFinding(label, severity, body, nextStep, evidence, category) {
  return {
    label: label,
    severity: severity,
    body: body,
    nextStep: nextStep,
    evidence: evidence || [],
    category: category || 'SOC 2 review'
  };
}

function analyzeSoc2Report(rawText, pages, context, profile) {
  const findings = [];
  const fullText = rawText.toLowerCase();

  if (!profile.socFit) {
    findings.push(makeFinding(
      'Document fit',
      'High',
      'This does not look like enough SOC 2 text to rely on. It could be incomplete, not a SOC 2 report, or an image-only PDF.',
      'Ask for the latest SOC 2 Type II report for the service you use, or ask for a searchable copy.',
      profile.socEvidence,
      'Report integrity'
    ));
  }

  if (!profile.typeII) {
    findings.push(makeFinding(
      'Report type',
      'High',
      'The scan could not clearly find SOC 2 Type II coverage. A Type I report only shows control design at one point in time.',
      'Check for Type II coverage or write down why another type of assurance is okay.',
      profile.typeEvidence,
      'Report integrity'
    ));
  }

  if (profile.opinion === 'Qualified or adverse language found') {
    findings.push(makeFinding(
      'Auditor opinion',
      'High',
      'The report includes qualified, adverse, or disclaimer language. That can make the SOC 2 less reliable.',
      'Bring this to security and privacy. Ask for the management response, fix status, and any backup controls.',
      profile.opinionEvidence,
      'Report integrity'
    ));
  } else if (profile.opinion === 'Needs a check') {
    findings.push(makeFinding(
      'Auditor opinion',
      'Medium',
      'The scan could not confirm an independent auditor opinion from the text it pulled out.',
      'Check the opinion in the auditor report before you close the review.',
      [],
      'Report integrity'
    ));
  }

  if (!profile.periodEnd) {
    findings.push(makeFinding(
      'Coverage period',
      'Medium',
      'The scan could not find the audit end date.',
      'Write down the SOC 2 dates and decide whether you need a bridge letter.',
      [],
      'Report integrity'
    ));
  } else if (profile.ageDays > 180) {
    findings.push(makeFinding(
      'Coverage period',
      profile.ageDays > 365 ? 'High' : 'Medium',
      'The audit period ended ' + profile.ageDays + ' days ago (' + dateLabel(profile.periodEnd) + '). You may need something more current.',
      'Follow your bridge-letter process and ask for current coverage or a management attestation if needed.',
      [],
      'Report integrity'
    ));
  }

  if (profile.exceptions.length) {
    findings.push(makeFinding(
      'Control exceptions',
      'Medium',
      'The report includes exception, deviation, deficiency, or failed-control wording that needs a closer look.',
      'Figure out which controls were affected, what caused it, when it will be fixed, and what it means for your use case.',
      profile.exceptions,
      'Control operation'
    ));
  }

  if (profile.cuecs.length) {
    findings.push(makeFinding(
      'Customer-owned CUECs',
      'Medium',
      'The report includes complementary user entity controls (CUECs). These are things your organization or vendor owner needs to do for the controls to work as described.',
      'Give each CUEC an owner and keep that list with the review.',
      profile.cuecs,
      'Customer responsibilities'
    ));
  } else {
    findings.push(makeFinding(
      'Check for CUECs',
      'Low',
      'The scan did not find CUECs. They may still be in the report or the PDF text may not have come through cleanly.',
      'Search the original report for CUECs and note whether your organization has any responsibilities.',
      [],
      'Customer responsibilities'
    ));
  }

  if (profile.carveOut.length) {
    findings.push(makeFinding(
      'Carved-out subservice organizations',
      'Medium',
      'The report mentions a carve-out, so some important provider controls may sit outside the SOC 2 testing boundary.',
      'List important hosting, support, payment, and processing providers. Ask for their assurance or the vendor\'s oversight evidence.',
      profile.carveOut,
      'Third parties'
    ));
  } else if (profile.subservice.length) {
    findings.push(makeFinding(
      'Subservice providers',
      'Low',
      'The report mentions subservice organizations. Check how their controls are handled before you close the review.',
      'Check whether the report uses the inclusive or carve-out method and note any important dependencies.',
      profile.subservice,
      'Third parties'
    ));
  }

  ['student', 'phi', 'pci', 'glba', 'research'].forEach(function (key) {
    if (!context.has(key)) {
      return;
    }
    const evidence = findEvidence(contextRules[key], pages, 2);
    if (!evidence.length) {
      findings.push(makeFinding(
        contextLabel(key) + ' context',
        'Medium',
        'The scan did not find much about this selected data type in the SOC 2 text.',
        'Confirm the data scope and contract needs. Ask for the right privacy, security, retention, deletion, and notification details.',
        [],
        'Data risk'
      ));
    } else {
      findings.push(makeFinding(
        contextLabel(key) + ' context',
        'Info',
        'The report has language related to this data type. A SOC 2 mention by itself does not prove the contract or legal pieces are covered.',
        'Check the data flow, contract terms, and any needed DPA, BAA, or data-use terms.',
        evidence,
        'Data risk'
      ));
    }
  });

  if (context.has('critical')) {
    const identityEvidence = findEvidence(['multi-factor', 'multifactor', 'mfa', 'single sign-on', 'sso', 'access review', 'privileged access'], pages, 2);
    const resilienceEvidence = findEvidence(['incident response', 'disaster recovery', 'business continuity', 'rto', 'rpo'], pages, 2);
    if (!identityEvidence.length) {
      findings.push(makeFinding(
        'Critical-service identity controls',
        'Medium',
        'The scan did not find MFA, SSO, or access-management evidence for this critical or SSO-required service.',
        'Check authentication, MFA, SSO, privileged access, and offboarding controls.',
        [],
        'Critical service'
      ));
    }
    if (!resilienceEvidence.length) {
      findings.push(makeFinding(
        'Critical-service resilience',
        'Medium',
        'The scan did not find incident response or continuity evidence for this critical service.',
        'Ask for incident escalation, continuity testing, backup, RTO, and RPO details that fit how critical the service is.',
        [],
        'Critical service'
      ));
    }
  }

  const restrictedSignals = findEvidence(['ferpa', 'phi', 'hipaa', 'pci', 'payment card', 'glba', 'research data', 'controlled unclassified', 'restricted data'], pages, 2);
  if (restrictedSignals.length && !['student', 'phi', 'pci', 'glba', 'research'].some(function (key) { return context.has(key); })) {
    findings.push(makeFinding(
      'Potential restricted-data signal',
      'Low',
      'The report mentions protected or regulated data, but none of the matching data options were selected above.',
      'Check what data the vendor will get, pick the right option, and scan again before you close the review.',
      restrictedSignals,
      'Data risk'
    ));
  }

  if (profile.socFit && profile.typeII && profile.opinion !== 'Qualified or adverse language found' && !profile.exceptions.length) {
    findings.unshift(makeFinding(
      'Basic SOC 2 check',
      'Info',
      'The scan found SOC 2 Type II wording and did not see obvious qualified-opinion or exception language in the matched text.',
      'Still check the scope, dates, CUECs, subservice providers, and data details before approval.',
      profile.socEvidence.concat(profile.typeEvidence).slice(0, 2),
      'Report integrity'
    ));
  }
  return findings;
}

function determinePosture() {
  const high = state.findings.filter(function (finding) { return finding.severity === 'High'; }).length;
  const medium = state.findings.filter(function (finding) { return finding.severity === 'Medium'; }).length;
  if (high) {
    return { label: 'Needs attention', detail: high + ' high-priority ' + pluralize(high, 'finding') + ' need to be fixed or signed off on.' };
  }
  if (medium) {
    return { label: 'Review needed', detail: medium + ' important ' + pluralize(medium, 'follow-up') + ' should be handled before approval.' };
  }
  return { label: 'Ready to decide', detail: 'The scan did not find high or medium flags. Check the evidence and make your final call.' };
}

function checklistStats() {
  const scorable = state.checklistResults.filter(function (item) {
    return !['Manual', 'Not applicable'].includes(item.status);
  });
  const satisfactory = scorable.filter(function (item) { return item.status === 'Satisfactory'; }).length;
  const review = state.checklistResults.filter(function (item) { return item.status === 'Needs review'; }).length;
  const missing = state.checklistResults.filter(function (item) { return item.status === 'Not found'; }).length;
  const coverage = scorable.length ? Math.round((satisfactory / scorable.length) * 100) : 0;
  return { scorable: scorable.length, satisfactory: satisfactory, review: review, missing: missing, coverage: coverage };
}

function filteredFindings() {
  const query = state.riskSearch.trim().toLowerCase();
  if (!query) {
    return state.findings;
  }
  return state.findings.filter(function (finding) {
    return [finding.label, finding.severity, finding.category, finding.body, finding.nextStep].join(' ').toLowerCase().includes(query);
  });
}

function filteredChecklist() {
  return state.checklistResults.filter(function (item) {
    return (state.domain === 'all' || item.domain === state.domain) && (state.status === 'all' || item.status === state.status);
  });
}

function openChecklistItems() {
  return state.checklistResults.filter(function (item) {
    return ['Needs review', 'Not found'].includes(item.status);
  });
}

function renderMetrics() {
  if (!state.hasReport) {
    elements.metrics.innerHTML = [
      '<article class="metric-card idle-card"><span>Report</span><strong>Nothing yet</strong><p>Add one SOC 2 report to get started.</p></article>',
      '<article class="metric-card idle-card"><span>Quick status</span><strong>-</strong><p>This appears after the scan runs.</p></article>',
      '<article class="metric-card idle-card"><span>Checklist matches</span><strong>-</strong><p>Matches link back to report pages.</p></article>',
      '<article class="metric-card idle-card"><span>Follow-ups</span><strong>-</strong><p>These come from the report and checklist.</p></article>'
    ].join('');
    return;
  }

  const stats = checklistStats();
  const posture = determinePosture();
  const high = state.findings.filter(function (finding) { return finding.severity === 'High'; }).length;
  const open = openChecklistItems().length;
  const cards = [
    ['Report scanned', state.extractedWords.toLocaleString() + ' words', state.reportName],
    ['Quick status', posture.label, posture.detail],
    ['Checklist matches', stats.coverage + '%', stats.satisfactory + ' of ' + stats.scorable + ' checklist items have a match'],
    ['Follow-ups', String(open + high), high + ' high-priority item(s), ' + open + ' thing(s) to ask for']
  ];
  elements.metrics.innerHTML = cards.map(function (card) {
    return '<article class="metric-card"><span>' + escapeHtml(card[0]) + '</span><strong>' + escapeHtml(card[1]) + '</strong><p>' + escapeHtml(card[2]) + '</p></article>';
  }).join('');
}

function profileItem(label, value, detail) {
  return '<article class="profile-item"><span>' + escapeHtml(label) + '</span><strong>' + escapeHtml(value) + '</strong><p>' + escapeHtml(detail) + '</p></article>';
}

function renderProfile() {
  if (!state.hasReport) {
    elements.reportProfile.innerHTML = '';
    return;
  }
  const profile = state.profile;
  const period = profile.periodEnd ? dateLabel(profile.periodEnd) + ' (' + profile.ageDays + ' days ago)' : 'Not detected';
  const criteria = profile.criteria.length ? profile.criteria.join(', ') : 'Not detected';
  elements.reportProfile.innerHTML = [
    profileItem('SOC 2 basics', profile.socFit ? 'Found' : 'Check this', profile.socFit ? 'Found SOC 2 and trust-services wording.' : 'Look at the original report or the extracted text.'),
    profileItem('Report type', profile.typeII ? 'Type II found' : 'Check this', profile.typeII ? 'Found wording about controls operating over time.' : 'Type II wording was not clearly found.'),
    profileItem('Audit period end', period, 'You decide whether a bridge letter is needed.'),
    profileItem('Trust services', criteria, 'These words showed up in the extracted text.'),
    profileItem('Auditor opinion', profile.opinion, 'Always check the actual opinion in the original report.')
  ].join('');
}

function renderCoverage() {
  if (!state.hasReport) {
    elements.coverageSummary.textContent = 'Not scanned';
    elements.coverageChart.innerHTML = '<div class="empty-state"><strong>No report yet</strong><p>Add a searchable SOC 2 PDF or paste the text, then run the scan.</p></div>';
    return;
  }

  const grouped = state.checklistResults.reduce(function (groups, item) {
    if (['Manual', 'Not applicable'].includes(item.status)) {
      return groups;
    }
    groups[item.domain] = groups[item.domain] || [];
    groups[item.domain].push(item.status === 'Satisfactory' ? 100 : item.status === 'Needs review' ? 50 : 0);
    return groups;
  }, {});
  const scores = Object.keys(grouped).map(function (domain) {
    const values = grouped[domain];
    return { domain: domain, score: Math.round(values.reduce(function (total, value) { return total + value; }, 0) / values.length) };
  });
  const average = scores.length ? Math.round(scores.reduce(function (total, item) { return total + item.score; }, 0) / scores.length) : 0;
  elements.coverageSummary.textContent = average + '% checklist matches';
  elements.coverageChart.innerHTML = scores.length ? scores.map(function (item) {
    return '<div class="bar-row"><strong>' + escapeHtml(displayText(item.domain)) + '</strong><div class="bar-track"><div class="bar-fill" style="width: ' + item.score + '%"></div></div><span>' + item.score + '%</span></div>';
  }).join('') : '<div class="empty-state"><strong>No checklist items to score</strong><p>Check the options you selected before reading this score.</p></div>';
}

function renderConcerns() {
  if (!state.hasReport) {
    elements.concernList.innerHTML = '<article class="concern idle-card"><h3>Waiting for a scan</h3><p>Anything to look at will show up after you scan a SOC 2 report.</p></article>';
    return;
  }
  const findings = state.findings.filter(function (finding) { return ['High', 'Medium'].includes(finding.severity); }).slice(0, 3);
  const requests = openChecklistItems().slice(0, 3);
  const cards = findings.map(function (finding) {
    return '<article class="concern"><span class="badge severity-' + finding.severity.toLowerCase() + '">' + escapeHtml(finding.severity) + '</span><h3>' + escapeHtml(finding.label) + '</h3><p>' + escapeHtml(finding.body) + '</p></article>';
  });
  if (!cards.length) {
    cards.push.apply(cards, requests.map(function (item) {
      return '<article class="concern"><h3>' + escapeHtml(checklistTitle(item.item)) + '</h3><p>' + escapeHtml(item.analysis) + '</p></article>';
    }));
  }
  elements.concernList.innerHTML = cards.length ? cards.join('') : '<article class="concern"><h3>No big flags from the scan</h3><p>Still check the scope, opinion, data details, and your final decision before approval.</p></article>';
}

function evidenceMarkup(evidence, summary) {
  if (!evidence || !evidence.length) {
    return '';
  }
  return '<details><summary>' + (summary || 'View report evidence') + '</summary>' + evidence.map(function (item) {
    return '<blockquote><strong>' + escapeHtml(pageLabel(item.page)) + '</strong><br>' + escapeHtml(item.excerpt) + '</blockquote>';
  }).join('') + '</details>';
}

function renderRiskTable() {
  if (!state.hasReport) {
    elements.riskTable.innerHTML = '<div class="empty-state"><strong>No findings yet</strong><p>Run a SOC 2 scan first.</p></div>';
    return;
  }
  const findings = filteredFindings();
  if (!findings.length) {
    elements.riskTable.innerHTML = '<div class="empty-state"><strong>No matching findings</strong><p>Clear the search or use a different term.</p></div>';
    return;
  }
  elements.riskTable.innerHTML = '<table><thead><tr><th>Finding</th><th>Severity</th><th>Analysis</th><th>Next step</th><th>Evidence</th></tr></thead><tbody>' + findings.map(function (finding) {
    const source = finding.evidence.length ? finding.evidence.map(function (item) { return pageLabel(item.page); }).join(', ') : 'No saved excerpt';
    return '<tr><td><strong>' + escapeHtml(finding.label) + '</strong><br><span class="table-category">' + escapeHtml(finding.category) + '</span></td><td class="severity-' + finding.severity.toLowerCase() + '">' + escapeHtml(finding.severity) + '</td><td>' + escapeHtml(finding.body) + '</td><td>' + escapeHtml(finding.nextStep) + '</td><td>' + escapeHtml(source) + evidenceMarkup(finding.evidence, 'View excerpt') + '</td></tr>';
  }).join('') + '</tbody></table>';
}

function checklistCard(item) {
  const statusClass = item.status.toLowerCase().replace(/\s+/g, '-');
  const evidence = item.evidence || [];
  return '<article class="checklist-item status-' + statusClass + '"><div class="checklist-top"><div><span>Checklist row ' + escapeHtml(item.row) + ' | ' + escapeHtml(displayText(item.domain)) + '</span><h3>' + escapeHtml(checklistTitle(item.item)) + '</h3></div><span class="badge ' + statusClass + '">' + escapeHtml(item.status) + '</span></div><p><b>Scan result:</b> ' + escapeHtml(item.score) + '</p><p><b>What it means:</b> ' + escapeHtml(item.analysis) + '</p>' + evidenceMarkup(evidence, 'Where the SOC mentions it') + '</article>';
}

function renderControls() {
  if (!state.hasReport) {
    elements.controlGrid.innerHTML = '<article class="control-card idle-card"><div><span>Waiting for a SOC 2</span><h3>The checklist appears after a scan</h3></div><p>Once there is report text, the tool will look for matches in each checklist item.</p></article>';
    return;
  }
  const results = filteredChecklist();
  elements.controlGrid.innerHTML = results.length ? results.map(checklistCard).join('') : '<div class="empty-state"><strong>No checklist rows match these filters</strong><p>Change the domain or result-status filter to see more of the review.</p></div>';
}

function renderEvidence() {
  if (!state.hasReport) {
    elements.evidenceList.innerHTML = '<article class="evidence-item idle-card"><div class="evidence-top"><div><span>Waiting for a scan</span><h3>Nothing to ask for yet</h3></div></div><p>This list fills in after you scan a report.</p></article>';
    return;
  }
  const source = state.showAllEvidence ? state.checklistResults : openChecklistItems();
  elements.showEvidence.textContent = state.showAllEvidence ? 'Show open requests' : 'Show all checklist items';
  if (!source.length) {
    elements.evidenceList.innerHTML = '<article class="evidence-item"><h3>Nothing open right now</h3><p>No checklist items are marked not found or needing review. Make your final call before closing.</p></article>';
    return;
  }
  elements.evidenceList.innerHTML = source.map(function (item) {
    const statusClass = item.status.toLowerCase().replace(/\s+/g, '-');
    const requested = ['Not found', 'Needs review'].includes(item.status) ? 'Ask for supporting documents, or write down why this item does not apply.' : 'The scan found report text. Keep the page reference and make sure it really supports your review.';
    return '<article class="evidence-item"><div class="evidence-top"><div><span>Checklist row ' + escapeHtml(item.row) + ' | ' + escapeHtml(displayText(item.domain)) + '</span><h3>' + escapeHtml(checklistTitle(item.item)) + '</h3></div><span class="badge ' + statusClass + '">' + escapeHtml(item.status) + '</span></div><p>' + escapeHtml(item.analysis) + '</p><span>' + escapeHtml(requested) + '</span>' + evidenceMarkup(item.evidence, 'View report evidence') + '</article>';
  }).join('');
}

function renderBrief() {
  if (!state.hasReport) {
    elements.briefOutput.innerHTML = '<div class="idle-card"><strong>No summary yet</strong><p>Scan a SOC 2 report to get a quick recap.</p></div>';
    return;
  }
  const posture = determinePosture();
  const stats = checklistStats();
  const high = state.findings.filter(function (finding) { return finding.severity === 'High'; });
  const medium = state.findings.filter(function (finding) { return finding.severity === 'Medium'; });
  const contexts = Array.from(state.context).map(contextLabel);
  const focus = high.concat(medium).slice(0, 3).map(function (finding) { return finding.label; });
  elements.briefOutput.innerHTML = [
    '<div><strong>Quick status: ' + escapeHtml(posture.label) + '</strong><p>' + escapeHtml(posture.detail) + '</p></div>',
    '<div><strong>Quick recap</strong><p>' + escapeHtml(state.reportName) + ' looks like ' + (state.profile.typeII ? 'a SOC 2 Type II report' : 'a report that still needs Type II confirmation') + '. The scan found matches for ' + stats.satisfactory + ' of ' + stats.scorable + ' checklist items; ' + stats.review + ' need a closer look and ' + stats.missing + ' had no match.</p></div>',
    '<div><strong>Main things to check</strong><p>' + escapeHtml(focus.length ? focus.join('; ') : 'No high or medium flags from the scan. Check the report evidence before you finish.') + '</p></div>',
    '<div><strong>What you picked</strong><p>' + escapeHtml(contexts.length ? contexts.join(', ') : 'No data or critical-service options were picked. Check the vendor data scope before closing.') + '</p></div>'
  ].join('');
}

function renderAssistantOutput() {
  if (!state.hasReport) {
    elements.assistantOutput.innerHTML = '<div class="idle-card"><strong>Ready to scan</strong><p>Add a searchable SOC 2 PDF or paste the report text, pick what applies, then select Scan report.</p></div>';
    return;
  }
  const posture = determinePosture();
  const summary = makeFinding('Scan summary', 'Info', 'The scan made ' + state.findings.length + ' ' + pluralize(state.findings.length, 'note') + ' from ' + state.extractedWords.toLocaleString() + ' words. ' + posture.detail, 'Use the linked pages as a starting point, then check the original report before making your risk decision.', [], 'Scan notes');
  elements.assistantOutput.innerHTML = [summary].concat(state.findings).map(function (finding) {
    return '<div class="finding severity-' + finding.severity.toLowerCase() + '"><div class="finding-title"><strong>' + escapeHtml(finding.label) + '</strong><span>' + escapeHtml(finding.severity) + '</span></div><p>' + escapeHtml(finding.body) + '</p><p><b>Next step:</b> ' + escapeHtml(finding.nextStep) + '</p>' + evidenceMarkup(finding.evidence, 'Matching report text') + '</div>';
  }).join('');
}

function renderAll() {
  renderMetrics();
  renderProfile();
  renderCoverage();
  renderConcerns();
  renderRiskTable();
  renderControls();
  renderEvidence();
  renderBrief();
  renderAssistantOutput();
}

function updateActionState() {
  elements.generateBrief.disabled = !state.hasReport;
  elements.downloadWorkpaper.disabled = !state.hasReport;
  elements.resetScan.disabled = !state.hasReport;
  if (!state.hasReport) {
    elements.reviewStatus.textContent = 'Ready';
    return;
  }
  const high = state.findings.filter(function (finding) { return finding.severity === 'High'; }).length;
  const medium = state.findings.filter(function (finding) { return finding.severity === 'Medium'; }).length;
  elements.reviewStatus.textContent = high ? high + ' high' : medium ? 'Review' : 'Ready';
}

function clearScan() {
  state.hasReport = false;
  state.reportName = '';
  state.rawText = '';
  state.pages = [];
  state.extractedWords = 0;
  state.findings = [];
  state.checklistResults = [];
  state.profile = null;
  state.context = new Set();
  state.domain = 'all';
  state.status = 'all';
  state.riskSearch = '';
  state.showAllEvidence = false;
  elements.evidenceInput.value = '';
  elements.reportUpload.value = '';
  elements.fileStatus.textContent = 'No report yet. Searchable SOC 2 PDFs work best.';
  elements.riskSearch.value = '';
  elements.domainFilter.value = 'all';
  elements.statusFilter.value = 'all';
  document.querySelectorAll('input[name="reviewContext"]').forEach(function (input) { input.checked = false; });
  elements.extractedTextDetails.hidden = true;
  elements.extractedText.textContent = '';
  updateActionState();
  renderAll();
}

function scanReport() {
  const rawText = elements.evidenceInput.value.trim();
  if (!rawText) {
    clearScan();
    elements.assistantOutput.innerHTML = '<div class="idle-card"><strong>No report text</strong><p>Add a searchable SOC 2 PDF or paste the report text to start.</p></div>';
    return;
  }

  const pages = state.pages.length ? state.pages : [{ number: null, text: rawText }];
  const extractedWords = words(rawText).length;
  state.context = selectedContext();
  state.rawText = rawText;
  state.pages = pages;
  state.extractedWords = extractedWords;
  state.reportName = state.reportName || 'Pasted SOC 2 text';
  state.profile = analyzeProfile(rawText, pages);
  state.findings = analyzeSoc2Report(rawText, pages, state.context, state.profile);
  state.checklistResults = checklistSource.map(function (entry) {
    return evaluateChecklistItem(entry, pages, state.context);
  });
  state.hasReport = true;
  elements.fileStatus.textContent = 'Done: ' + state.reportName + ' gave the scan ' + extractedWords.toLocaleString() + ' words across ' + pages.length + ' ' + pluralize(pages.length, 'page') + '.';
  elements.extractedText.textContent = rawText;
  elements.extractedTextDetails.hidden = false;
  updateActionState();
  renderAll();
}

function readFileAsText(file) {
  return new Promise(function (resolve, reject) {
    const reader = new FileReader();
    reader.onload = function () { resolve(reader.result); };
    reader.onerror = function () { reject(new Error('The report could not be read.')); };
    reader.readAsText(file);
  });
}

function readFileAsArrayBuffer(file) {
  return new Promise(function (resolve, reject) {
    const reader = new FileReader();
    reader.onload = function () { resolve(reader.result); };
    reader.onerror = function () { reject(new Error('The PDF could not be read.')); };
    reader.readAsArrayBuffer(file);
  });
}

async function extractPdfText(file) {
  const pdfjsLib = await loadPdfjs();
  const data = await readFileAsArrayBuffer(file);
  const pdf = await pdfjsLib.getDocument({ data: data }).promise;
  const pages = [];
  for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
    const page = await pdf.getPage(pageNumber);
    const content = await page.getTextContent();
    pages.push({ number: pageNumber, text: content.items.map(function (item) { return item.str; }).join(' ') });
  }
  const text = pages.map(function (page) { return page.text; }).join('\n\n');
  if (words(text).length < 80) {
    throw new Error('The PDF did not have much readable text. It may be image-only; try a searchable SOC 2 report or paste OCR text.');
  }
  return { text: text, pages: pages };
}

function loadPdfjs() {
  if (!pdfjsLib) {
    throw new Error('The PDF reader did not load. Check your internet connection, refresh the page, and try again.');
  }
  return Promise.resolve(pdfjsLib);
}

async function handleReportUpload(event) {
  const file = event.target.files[0];
  if (!file) {
    return;
  }
  elements.fileStatus.textContent = 'Reading ' + file.name + '...';
  elements.analyzeText.disabled = true;
  try {
    const extracted = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')
      ? await extractPdfText(file)
      : { text: await readFileAsText(file), pages: [] };
    state.reportName = file.name;
    state.pages = extracted.pages.length ? extracted.pages : [{ number: null, text: extracted.text }];
    elements.evidenceInput.value = extracted.text.trim();
    scanReport();
  } catch (error) {
    state.pages = [];
    elements.fileStatus.textContent = error.message;
    elements.assistantOutput.innerHTML = '<div class="idle-card"><strong>Report not scanned</strong><p>' + escapeHtml(error.message) + '</p></div>';
  } finally {
    elements.analyzeText.disabled = false;
  }
}

function csvCell(value) {
  return '"' + String(value === undefined || value === null ? '' : value).replace(/"/g, '""').replace(/\r?\n/g, ' ') + '"';
}

function downloadWorkpaper() {
  if (!state.hasReport) {
    return;
  }
  const rows = [
    ['SOC 2 Scan Notes'],
    ['Report', state.reportName],
    ['Scan date', dateLabel(currentReviewDate())],
    ['Quick status', determinePosture().label],
    ['Context', Array.from(state.context).map(contextLabel).join('; ')],
    [],
    ['Things found'],
    ['Category', 'Finding', 'Severity', 'What it means', 'Next step', 'Report pages', 'Report excerpt'],
  ];
  state.findings.forEach(function (finding) {
    rows.push([
      finding.category,
      finding.label,
      finding.severity,
      finding.body,
      finding.nextStep,
      finding.evidence.map(function (item) { return pageLabel(item.page); }).join('; '),
      finding.evidence.map(function (item) { return item.excerpt; }).join(' | ')
    ]);
  });
  rows.push([]);
  rows.push(['Checklist results']);
  rows.push(['Checklist row', 'Area', 'Checklist item', 'Status', 'Scan result', 'What it means', 'Report pages', 'Report excerpt']);
  state.checklistResults.forEach(function (item) {
    rows.push([
      item.row,
      displayText(item.domain),
      checklistText(item.item),
      item.status,
      item.score,
      item.analysis,
      item.evidence.map(function (evidence) { return pageLabel(evidence.page); }).join('; '),
      item.evidence.map(function (evidence) { return evidence.excerpt; }).join(' | ')
    ]);
  });
  const csv = rows.map(function (row) { return row.map(csvCell).join(','); }).join('\r\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = state.reportName.replace(/\.[^.]+$/, '') + '-soc2-scan-results.csv';
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

function renderDomains() {
  const domains = unique(checklistSource.map(function (item) { return item.domain; }));
  elements.domainFilter.innerHTML = '<option value="all">All domains</option>' + domains.map(function (domain) {
    return '<option value="' + escapeHtml(domain) + '">' + escapeHtml(displayText(domain)) + '</option>';
  }).join('');
}

elements.navItems.forEach(function (item) {
  item.addEventListener('click', function () {
    elements.navItems.forEach(function (nav) { nav.classList.remove('active'); });
    elements.views.forEach(function (view) { view.classList.remove('active'); });
    item.classList.add('active');
    document.getElementById(item.dataset.view).classList.add('active');
  });
});

elements.analyzeText.addEventListener('click', scanReport);
elements.reportUpload.addEventListener('change', handleReportUpload);
elements.generateBrief.addEventListener('click', function () {
  elements.navItems.forEach(function (nav) { nav.classList.toggle('active', nav.dataset.view === 'assistant'); });
  elements.views.forEach(function (view) { view.classList.toggle('active', view.id === 'assistant'); });
});
elements.resetScan.addEventListener('click', clearScan);
elements.downloadWorkpaper.addEventListener('click', downloadWorkpaper);
elements.domainFilter.addEventListener('change', function (event) {
  state.domain = event.target.value;
  renderControls();
});
elements.statusFilter.addEventListener('change', function (event) {
  state.status = event.target.value;
  renderControls();
});
elements.riskSearch.addEventListener('input', function (event) {
  state.riskSearch = event.target.value;
  renderRiskTable();
});
elements.showEvidence.addEventListener('click', function () {
  state.showAllEvidence = !state.showAllEvidence;
  renderEvidence();
});
document.querySelectorAll('input[name="reviewContext"]').forEach(function (input) {
  input.addEventListener('change', function () {
    if (state.hasReport) {
      scanReport();
    }
  });
});

renderDomains();
updateActionState();
renderAll();
