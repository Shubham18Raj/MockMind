const pdfParse = require('pdf-parse/lib/pdf-parse.js');

const extractTextFromPDF = async (fileBuffer) => {
  try {
    const data = await pdfParse(fileBuffer);
    return data.text;
  } catch (err) {
    throw new Error('Failed to parse PDF: ' + err.message);
  }
};

module.exports = { extractTextFromPDF };