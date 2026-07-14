# SOC 2 Review Lab

This is a small student project for doing a first pass on one vendor SOC 2 report at a time. It helps turn a long report into a simple checklist, but it does not make the final risk call for you.

Open [index.html](index.html) in a modern browser. The app uses PDF.js from cdnjs to read PDFs, so you need an internet connection for PDF uploads. The report is read in your browser and is not sent to an app server.

## What It Checks

- Searchable SOC 2 PDFs or pasted report text.
- Page-by-page text and the report excerpt behind each match.
- The 123-row vendor-risk checklist included in this project.
- Whether a checklist item has evidence, needs a closer look, was not found, does not apply, or needs a manual check.
- The main SOC 2 details: report type, dates, opinion, exceptions, CUECs, subservice providers, and carve-outs.
- Extra prompts for FERPA, HIPAA/PHI, PCI, GLBA, research/CUI, and critical or SSO services.
- A short summary, follow-up list, and CSV download with the scan results.

## How To Use It

1. Open **SOC 2 Review** and add the vendor's current searchable SOC 2 report.
2. Pick the data types or service needs that apply to the vendor.
3. Scan the report, then look at the high and medium items in **Risks**.
4. Use **Checklist** to compare the page-linked matches with the original report.
5. Use **Evidence** to track anything you still need to ask the vendor for.
6. Download the CSV and make the final risk decision in your normal process.

## A Quick Heads-Up

This tool is a first pass, not an automatic approval tool. SOC 2 reports are written in lots of different ways, so a keyword match does not prove a control works or even applies. Always check the opinion, scope, dates, exceptions, CUECs, subservice providers, data flow, and contract needs in the original report.

Image-only PDFs need OCR before the tool can read them. The TestInc PDF in `TESTING` is made up and is only there for testing.
