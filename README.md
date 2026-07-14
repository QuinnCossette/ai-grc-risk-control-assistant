# SOC 2 Review Lab

This is a small student project I built to help with reviewing SOC 2 reports. The goal is to make the first pass of a vendor review a little faster by pulling out important information and matching it to a checklist. It is meant to help organize the review, not make the final risk decision.

To use it, just open [index.html](index.html) in a modern browser. The app uses PDF.js from cdnjs to read searchable PDF files, so you'll need an internet connection when uploading a report. Everything is processed in your browser, so the report is not uploaded to a server.

## What It Checks

- Searchable SOC 2 PDFs or pasted report text.
- Page-by-page text and the report excerpt behind each match.
- A 123-row vendor-risk checklist.
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

## Some Notes

This tool is only meant to help with the initial review. It doesn't automatically decide whether a vendor passes or fails. Since every SOC 2 report is written a little differently, you should still read the report yourself and verify things like the audit opinion, scope, dates, exceptions, CUECs, subservice providers, and any other important details.

Image-only PDFs need OCR before the tool can read them. The TestInc PDF in `TESTING` is made up and is only there for testing.
