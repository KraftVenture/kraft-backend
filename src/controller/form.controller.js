const pool = require('../db/config')
const ExcelJS = require("exceljs");
const path = require("path");

const form_submit = async (req, res) => {
    try {
        const { name, email, brand, subject } = req.body;

        if (!name || !email) {
            return res.status(400).send({ message: "Name and email is mandatory" });
        }

        const query = `insert into form_submission(name, email, brand, subject) values ($1, $2, $3, $4) returning *`
        const values = [name, email, brand, subject];

        const result = await pool.query(query, values);
        console.log("Inserted row: ", result.rows[0]);
        return res.status(200).send({ message: "Form Submitted Successfully! We'll reach out soon." })

    } catch (error) {
        console.log(error);
        return res.status(500).send({ message: "Internal Server Error" })
    }
}

const export_excel = async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM form_submission ORDER BY id ASC");
        const rows = result.rows;

        const workbook = new ExcelJS.Workbook();
        const sheet = workbook.addWorksheet("Form Submissions");

        if (rows.length === 0) {
            return res.status(404).send({ message: "No data found" });
        }

        const headers = Object.keys(rows[0]);
        sheet.columns = headers.map((key) => ({
            header: key.toUpperCase(),
            key,
            width: 25,
        }));

        sheet.getRow(1).eachCell((cell) => {
            cell.font = { bold: true, color: { argb: "FFFFFFFF" }, name: "Arial", size: 11 };
            cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF2563EB" } };
            cell.alignment = { horizontal: "center", vertical: "middle" };
        });

        rows.forEach((row, i) => {
            const addedRow = sheet.addRow(row);
            addedRow.eachCell((cell) => {
                cell.font = { name: "Arial", size: 10 };
                cell.fill = {
                    type: "pattern", pattern: "solid",
                    fgColor: { argb: i % 2 === 0 ? "FFF1F5F9" : "FFFFFFFF" },
                };
            });
        });

        // Stream the file directly to the browser as a download
        res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        res.setHeader("Content-Disposition", "attachment; filename=form_submissions.xlsx");

        await workbook.xlsx.write(res);
        res.end();

    } catch (error) {
        console.log(error);
        return res.status(500).send({ message: "Internal Server Error" });
    }
}

module.exports = { form_submit, export_excel }
