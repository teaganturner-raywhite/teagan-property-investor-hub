const SHEET_ID = '1Z00BH3fW1UT01nH8-687LzfyBddMaPbfFj0009GF84E';
const SHEET_NAME = 'Leads';
const NOTIFICATION_EMAIL = 'teagan.turner@raywhite.com';

function doGet() {
  return ContentService
    .createTextOutput('Teagan Investor Hub backend is connected.')
    .setMimeType(ContentService.MimeType.TEXT);
}

function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      throw new Error('No website submission was received.');
    }

    const data = JSON.parse(e.postData.contents);

    if (!data.name || !data.email || !data.phone) {
      throw new Error('Name, email and phone are required.');
    }

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

    sheet.appendRow([
      new Date(),
      data.name || '',
      data.email || '',
      data.phone || '',
      data.address || '',
      data.helpType || '',
      data.source || 'Property Investor Hub',
      data.page || '',
      JSON.stringify(data.results || []),
      JSON.stringify(data.scorecard || {}),
      data.notes || ''
    ]);

    SpreadsheetApp.flush();

    MailApp.sendEmail({
      to: NOTIFICATION_EMAIL,
      replyTo: data.email,
      name: 'Teagan Turner Investor Hub',
      subject: `New Investor Hub Lead: ${data.name}`,
      body:
        `Name: ${data.name}\n` +
        `Email: ${data.email}\n` +
        `Phone: ${data.phone}\n` +
        `Property: ${data.address || 'Not provided'}\n` +
        `Enquiry: ${data.helpType || 'Website enquiry'}\n\n` +
        `Results:\n${JSON.stringify(data.results || [], null, 2)}\n\n` +
        `Website page: ${data.page || ''}`
    });

    MailApp.sendEmail({
      to: data.email,
      subject: 'Your Property Investor Hub enquiry has been received',
      body:
        `Hi ${data.name},\n\n` +
        `Thank you for using the Property Investor Hub. I have received your details and will review the information provided.\n\n` +
        `Kind regards,\n\n` +
        `Teagan Turner\n` +
        `Investment Property Consultant\n` +
        `Ray White Springfield\n` +
        `0481 229 960`
    });

    return jsonResponse({
      ok: true,
      message: 'Lead saved successfully.'
    });

  } catch (error) {
    console.error(error);

    return jsonResponse({
      ok: false,
      error: error.message
    });
  }
}

function testSheetConnection() {
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

  sheet.appendRow([
    new Date(),
    'Website connection test',
    'teagan.turner@raywhite.com',
    '0481 229 960',
    '',
    'Apps Script Test',
    'Manual test',
    '',
    '',
    '',
    'If this row appears, Apps Script is connected to the correct sheet.'
  ]);

  SpreadsheetApp.flush();
}

function jsonResponse(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
