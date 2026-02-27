const pug = require('pug');

// Helper para compilar e renderizar
function renderPug(fileName, data) {
    return pug.renderFile(`./views/${fileName}.pug`, data);
}

exports.emdListPage = (tlist, d) => renderPug('index', { list: tlist, date: d });
exports.emdPage = (e, d) => renderPug('emd', { e: e, date: d});
exports.emdForm = (d) => renderPug('form', { date: d });
exports.emdFormData = (e, d) => renderPug('form', { emd: e, date: d });
exports.errorPage = (msg, d) => renderPug('error', { message: msg, date: d });
