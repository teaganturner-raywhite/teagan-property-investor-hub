const SHEET_ID = '1Z00BH3fW1UT01nH8-687LzfyBddMaPbfFj0009GF84E';
const SHEET_NAME = 'Leads';
const NOTIFICATION_EMAIL = 'teagan.turner@raywhite.com';

function doGet(e) {
  try {
    const action = (e && e.parameter && e.parameter.action) || 'status';

    if (action === 'test') {
      const sheet = getLeadSheet_();
      sheet.appendRow([
        new Date(),
        'Website connection test',
        'teagan.turner@raywhite.com',
        '0481 229 960',
        '',
        'Backend test',
        'Google Apps Script',
        '',
        '',
        '',
        'If this row appears, the deployed Web App is connected to the correct spreadsheet.'
      ]);
      SpreadsheetApp.flush();

      return output_({
        ok: true,
        message: 'Test row added to the Leads sheet.'
      });
    }

    return output_({
      ok: true,
      message: 'Teagan Property Investor Hub backend is live.'
    });
  } catch (error) {
    return output_({
      ok: false,
      error: error.message
    });
  }
}

function doPost(e) {
  try {
    const data = parseRequest_(e);

    if (!data.name || !data.email || !data.phone) {
      throw new Error('Name, email and phone are required.');
    }

    const sheet = getLeadSheet_();

    sheet.appendRow([
      new Date(),
      data.name || '',
      data.email || '',
      data.phone || '',
      data.address || '',
      data.helpType || '',
      data.source || 'Property Investor Hub',
      data.page || '',
      data.results || '',
      data.scorecard || '',
      data.notes || ''
    ]);

    SpreadsheetApp.flush();

    MailApp.sendEmail({
      to: NOTIFICATION_EMAIL,
      replyTo: data.email,
      name: 'Teagan Turner Investor Hub',
      subject: `New Investor Hub Lead: ${data.name} — ${data.helpType || 'Website enquiry'}`,
      body:
        `Name: ${data.name}\n` +
        `Email: ${data.email}\n` +
        `Phone: ${data.phone}\n` +
        `Property: ${data.address || 'Not provided'}\n` +
        `Enquiry: ${data.helpType || 'Website enquiry'}\n\n` +
        `Results:\n${data.results || 'Not supplied'}\n\n` +
        `Scorecard:\n${data.scorecard || 'Not supplied'}\n\n` +
        `Page: ${data.page || ''}`
    });

    MailApp.sendEmail({
      to: data.email,
      subject: 'Your Property Investor Hub enquiry has been received',
      body:
        `Hi ${data.name},\n\n` +
        `Thank you for using the Property Investor Hub. Your enquiry has been received and I will review the information provided.\n\n` +
        `Kind regards,\n\n` +
        `Teagan Turner\n` +
        `Investment Property Consultant\n` +
        `Ray White Springfield\n` +
        `0481 229 960`
    });

    return output_({
      ok: true,
      message: 'Lead saved successfully.'
    });
  } catch (error) {
    console.error(error);

    return output_({
      ok: false,
      error: error.message
    });
  }
}

function parseRequest_(e) {
  if (!e) throw new Error('No request was received.');

  // Preferred website format: URL-encoded form fields.
  if (e.parameter && Object.keys(e.parameter).length) {
    return {
      name: e.parameter.name || '',
      email: e.parameter.email || '',
      phone: e.parameter.phone || '',
      address: e.parameter.address || '',
      helpType: e.parameter.helpType || '',
      source: e.parameter.source || '',
      page: e.parameter.page || '',
      results: e.parameter.results || '',
      scorecard: e.parameter.scorecard || '',
      notes: e.parameter.notes || ''
    };
  }

  // Backwards compatibility with earlier JSON submissions.
  if (e.postData && e.postData.contents) {
    const parsed = JSON.parse(e.postData.contents);
    return {
      ...parsed,
      results: typeof parsed.results === 'string'
        ? parsed.results
        : JSON.stringify(parsed.results || []),
      scorecard: typeof parsed.scorecard === 'string'
        ? parsed.scorecard
        : JSON.stringify(parsed.scorecard || {})
    };
  }

  throw new Error('The request contained no lead data.');
}

function getLeadSheet_() {
  const spreadsheet = SpreadsheetApp.openById(SHEET_ID);
  let sheet = spreadsheet.getSheetByName(SHEET_NAME);

  if (!sheet) {
    sheet = spreadsheet.insertSheet(SHEET_NAME);
  }

  if (sheet.getLastRow() === 0) {
    sheet.appendRow([
      'Date',
      'Name',
      'Email',
      'Phone',
      'Address',
      'Help Type',
      'Source',
      'Page',
      'Calculator Results',
      'Scorecard',
      'Notes'
    ]);
  }

  return sheet;
}

function output_(payload) {
  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}
