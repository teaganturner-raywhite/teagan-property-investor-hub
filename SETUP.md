# Teagan Property Investor Hub — Setup

## GitHub Pages
Upload all files and the `assets` folder to the root of the new public GitHub repository.

Open **Settings → Pages** and select:
- Source: Deploy from a branch
- Branch: main
- Folder: /(root)

Save and wait a few minutes for the Pages URL.

## Google lead integration
The website is already configured with the existing Apps Script Web App URL and Sheet ID.

The Google Sheet tab should be named `Leads` and use these headings:

Date | Name | Email | Phone | Address | Help Type | Source | Page | Calculator Results | Scorecard | Notes

`Code.gs` is the matching backend. It belongs in Google Apps Script, not on the public website. If the current Apps Script already uses the same code and headings, no change is required.

## Defaults
- Ray White management fee: 8.8%
- Annual property growth: 7%
- Annual rental growth: 5%
- CPI / inflation: 3%
- All other numerical client fields are blank.

## Important limitations
The rental appraisal is a broad rules-based indication. It does not access live Pricefinder, CoreLogic, REA or Domain data. The depreciation, capital gains and investment calculations are indicative only and are not financial or tax advice.
