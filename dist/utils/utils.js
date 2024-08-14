"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.encryptPassword = encryptPassword;
exports.decryptPassword = decryptPassword;
const bcryptjs_1 = require("bcryptjs");
function encryptPassword(password) {
    const salt = (0, bcryptjs_1.genSaltSync)(10); //כמות הפעמים שהוא יעשה רנדומליות של סיבובים כדי לייצר את המפתח כלל שיש יותר סיבובים ככה המפתח יהיה יותר מאובטח
    const hash = (0, bcryptjs_1.hashSync)(password, salt);
    return hash;
}
function decryptPassword(password, hash) {
    return (0, bcryptjs_1.compareSync)(password, hash);
}
//# sourceMappingURL=utils.js.map