const { form_submit } = require('../controller/form.controller')

module.exports = (app) => {
    app.post('/submit', form_submit)
}
