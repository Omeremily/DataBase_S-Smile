"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_routes_1 = __importDefault(require("./users/user.routes"));
require("dotenv/config");
const PORT = process.env.PORT || 5555;
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.get('/', async (req, res) => {
    res.status(200).send('Hello World from server!');
});
app.use('/api/users', user_routes_1.default);
app.listen(PORT, () => console.log(`Server started on http://localhost:${PORT}`));
//# sourceMappingURL=main.js.map