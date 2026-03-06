const { form_submit, export_excel } = require('../controller/form.controller')

module.exports = (app) => {
    app.post('/submit', form_submit)
    app.get('/export', export_excel)
}
