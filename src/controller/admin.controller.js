const jwt = require('jsonwebtoken')

const adminLogin = async (req, res) => {
    try {
        const { username, password } = req.body
        if (username !== 'addy' && password !== 'domma_dom_chamar') {
            return res.status(400).send({ message: "Invalid Credentials" })
        }
        const jwt_token = jwt.sign({role: "admin"}, "domma_dom_chamar", { expiresIn: "1d" })

        return res.status(200).send({
            message: "admin Logged in",
            jwt_token
        })
    } catch (err) {
        console.log(err);
        return res.status(500).send({ message: "internal server error" })
    }
}

module.exports = { adminLogin }