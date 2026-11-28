/*
 * The pdf.js worker. pdf.js parses the PDF here, away from the page. The
 * module only loads the worker code of pdf.js; the main thread sends the work.
 */
import "pdfjs-dist/build/pdf.worker.min.mjs";
