"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController_1 = require("../controllers/userController");
const router = express_1.default.Router();
router.post('/signup', (req, res, next) => {
    (0, userController_1.signup)(req, res).catch(next);
});
router.post('/login', (req, res, next) => {
    (0, userController_1.login)(req, res).catch(next);
});
exports.default = router;
//# sourceMappingURL=userRoutes.js.map