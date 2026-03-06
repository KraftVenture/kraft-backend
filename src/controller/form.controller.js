const pool = require('../db/config')

const form_submit = async (req, res) => {
    try {
        const { name, email, brand, subject } = req.body;

        if(!name || !email){
            return res.status(400).send({message: "Name and email is mandatory"});
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

module.exports = { form_submit }