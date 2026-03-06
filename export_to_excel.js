require("dotenv").config();
const { Pool } = require("pg");
const ExcelJS = require("exceljs");
const path = require("path");

const pool = new Pool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: {
        rejectUnauthorized: false, // REQUIRED for Aiven
    },
});

async function exportToExcel() {
  const client = await pool.connect();

  try {
    const result = await client.query(
      "SELECT * FROM form_submission ORDER BY id ASC"
    );
    const rows = result.rows;

    if (rows.length === 0) {
      console.log("No data found in form_submission table.");
      return;
    }

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Form Submissions");

    // Header row
    const headers = Object.keys(rows[0]);
    sheet.columns = headers.map((key) => ({
      header: key.toUpperCase(),
      key,
      width: 25,
    }));

    // Style header row
    sheet.getRow(1).eachCell((cell) => {
      cell.font = { bold: true, color: { argb: "FFFFFFFF" }, name: "Arial", size: 11 };
      cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF2563EB" } };
      cell.alignment = { horizontal: "center", vertical: "middle" };
    });
    sheet.getRow(1).height = 25;

    // Add data rows
    rows.forEach((row, i) => {
      const addedRow = sheet.addRow(row);
      addedRow.eachCell((cell) => {
        cell.font = { name: "Arial", size: 10 };
        cell.alignment = { vertical: "middle" };
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: i % 2 === 0 ? "FFF1F5F9" : "FFFFFFFF" },
        };
      });
    });

    // Add total row
    const totalRow = sheet.addRow({});
    const firstCell = totalRow.getCell(1);
    firstCell.value = `Total Submissions: ${rows.length}`;
    firstCell.font = { bold: true, name: "Arial", size: 10 };

    const outputPath = path.join(__dirname, "form_submissions.xlsx");
    await workbook.xlsx.writeFile(outputPath);
    console.log(`✅ Exported ${rows.length} rows to form_submissions.xlsx`);
  } finally {
    client.release();
    await pool.end();
  }
}

exportToExcel().catch(console.error);