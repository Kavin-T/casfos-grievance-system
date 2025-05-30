/*
 * reportPDFHelper.js
 *
 * Purpose:
 * This script provides a utility function to generate an HTML content string for a PDF report of complaint data
 * in an Express.js application. The generated HTML is used to create a PDF report with formatted complaint details.
 *
 * Features:
 * - generateReport: Creates an HTML string for a complaint report, including a table of complaints, a logo, a header,
 *   and a total expenditure footer. Supports empty complaint lists with a "no complaints" message.
 * - Formats complaint data using helper functions for dates, statuses, and durations.
 * - Includes CSS styling for a clean, professional table layout in the PDF.
 * - Calculates the total expenditure across all complaints.
 * - Dynamically includes the application port from environment variables for the logo URL.
 *
 * Usage:
 * Import this module in your application (e.g., `const { generateReport } = require('./reportPDFHelper');`) and
 * pass an array of complaint objects to the `generateReport` function to produce an HTML content object suitable
 * for PDF generation (e.g., with html-pdf-node). The output can be used in a controller to generate and send a PDF.
 *
 * Dependencies:
 * - formatting.js: Provides helper functions for formatting status, date, and duration.
 * - dotenv: Environment variables (e.g., PORT) must be configured in a .env file.
 *
 * Notes:
 * - The complaint objects must include fields like complaintID, complainantName, subject, department, createdAt,
 *   resolvedAt, status, and price.
 * - The logo URL assumes a local server with a PORT environment variable and an accessible image at /assets/images/casfos_logo.jpg.
 * - The generated HTML is styled for PDF rendering with a table layout and Arial font.
 * - The function returns an object with a `content` property containing the HTML string, compatible with PDF generation libraries.
 */

const { dateFormat, calculateDuration, statusFormat } = require("./formatting");

// Function to generate HTML content for PDF report
const generateReport = async (complaints) => {
  // Initialize HTML content with styles and header
  let htmlContent = `
    <html>
        <head>
            <title>Complaints Report</title>
            <style>
                *, *::before, *::after {
                    box-sizing: border-box;
                }
                body {
                    padding-left: 20px;
                    padding-right: 20px;
                    font-family: Arial, sans-serif;
                }
                table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-top: 20px;
                    font-size: 12px;
                }
                th, td {
                    padding: 12px 15px;
                    text-align: left;
                    border: 1px solid #ddd;
                }
                th {
                    background-color: rgb(255, 255, 255);
                    font-weight: bold;
                }
                .logo {
                    width: 100px;
                    height: auto;
                    margin-bottom: 20px;
                }
                .heading {
                    text-align: center;
                    font-size: 24px;
                    font-weight: bold;
                    margin-bottom: 20px;
                }
                .footer {
                    margin-top: 20px;
                    text-align: right;
                    font-size: 18px;
                    font-weight: bold;
                    padding-right: 20px;
                }
                .no-data {
                    text-align: center;
                    margin-top: 20px;
                    font-size: 18px;
                    font-weight: bold;
                    color: #888;
                }
                .date {
                    position: absolute;
                    top: 20px;
                    right: 20px;
                    font-size: 20px;
                    font-weight: normal;
                }
            </style>
        </head>
        <body>
            <img src="http://localhost:${
              process.env.PORT
            }/assets/images/casfos_logo.jpg" class="logo" alt="Logo">
            <div class="heading">CENTRAL ACADEMY FOR STATE FOREST SERVICE</div>
            <div class="heading">COMPLAINT REPORT</div>
            <div class="date">Date: ${new Date().toLocaleDateString()}</div>
    `;

  if (complaints.length === 0) {
    // Add message for no complaints
    htmlContent += `
            <div class="no-data">No complaints to display.</div>
        </body>
    </html>
      `;
  } else {
    // Generate table if complaints exist
    let totalAmount = 0;

    htmlContent += `
            <table>
                <thead>
                    <tr>
                        <th>S.No</th>
                        <th>Complaint ID</th>
                        <th>Complainant Name</th>
                        <th>Subject</th>
                        <th>Department</th>
                        <th>Reported On</th>
                        <th>Resolved On</th>
                        <th>Status</th>
                        <th>Time elapsed</th>
                        <th>Expenditure</th>
                    </tr>
                </thead>
                <tbody>
      `;

    // Iterate through complaints to populate table rows
    complaints.forEach((complaint, index) => {
      const formattedCreatedAt = complaint.createdAt
        ? dateFormat(complaint.createdAt)
        : "N/A";
      const formattedResolvedAt = complaint.resolvedAt
        ? dateFormat(complaint.resolvedAt)
        : "In Progress";

      const status = statusFormat(complaint.status, complaint.department);

      let duration = "N/A";
      if (complaint.createdAt && complaint.resolvedAt) {
        duration = calculateDuration(complaint.createdAt, complaint.resolvedAt);
      } else {
        duration = calculateDuration(complaint.createdAt, new Date());
      }

      const price = parseFloat(complaint.price.toString()) || 0;
      totalAmount += price;

      htmlContent += `
            <tr>
                <td>${index + 1}</td>
                <td>${complaint.complaintID}</td>
                <td>${complaint.complainantName || "N/A"}</td>
                <td>${complaint.subject || "N/A"}</td>
                <td>${complaint.department || "N/A"}</td>
                <td>${formattedCreatedAt}</td>
                <td>${formattedResolvedAt}</td>
                <td>${status}</td>
                <td>${duration}</td>
                <td>${price == 0 ? "Not Entered" : price.toFixed(2)}</td>
            </tr>
        `;
    });

    htmlContent += `
                </tbody>
            </table>
            <div class="footer">
                Total Amount: ₹${totalAmount.toFixed(2)}
            </div>
        </body>
    </html>
      `;
  }

  const file = { content: htmlContent };
  return file;
};

module.exports = { generateReport };
