const fs = require('fs');
const PDFParser = require('pdf-parse');
const PptxExtractor = require('pptx-extractor');
const DocxExtractor = require('docx-extractor');

// Function to count words in text
function countWords(text) {
    return text.trim().split(/\s+/).length;
}

// Function to estimate reading time
function estimateReadingTime(words) {
    // Assuming an average reading speed of 200 words per minute
    const wordsPerMinute = 200;
    const minutes = words / wordsPerMinute;
    return Math.ceil(minutes); // Round up to nearest minute
}

// Function to extract text from PDF
async function extractTextFromPDF(pdfPath) {
    const dataBuffer = fs.readFileSync(pdfPath);
    const pdfData = await PDFParser(dataBuffer);
    return pdfData.text;
}

// Function to extract text from PPTX
async function extractTextFromPPTX(pptxPath) {
    const pptx = await PptxExtractor.load(pptxPath);
    return pptx.getText();
}

// Function to extract text from DOCX
async function extractTextFromDOCX(docxPath) {
    const docx = await DocxExtractor.process(docxPath);
    return docx.getContent();
}

// Main function to calculate reading time
async function calculateReadingTime(filePath) {
    let text = '';
    if (filePath.endsWith('.pdf')) {
        text = await extractTextFromPDF(filePath);
    } else if (filePath.endsWith('.pptx')) {
        text = await extractTextFromPPTX(filePath);
    } else if (filePath.endsWith('.docx')) {
        text = await extractTextFromDOCX(filePath);
    } else if (filePath.endsWith('.txt')) {
        text = fs.readFileSync(filePath, 'utf-8');
    } else {
        throw new Error('Unsupported file format');
    }

    const wordCount = countWords(text);
    const readingTime = estimateReadingTime(wordCount);
    console.log(`Estimated reading time: ${readingTime} minute(s)`);
}

// Usage
const filePath = 'path/to/your/file.pdf'; // Change this to your file path
calculateReadingTime(filePath);

module.exports = calculateReadingTime;