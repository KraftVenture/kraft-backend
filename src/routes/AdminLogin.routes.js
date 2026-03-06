const { adminLogin } = require("../controller/admin.controller")

module.exports = (app) => {
    app.post('/adminLogin', adminLogin)
}