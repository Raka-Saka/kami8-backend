"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const roomController_1 = require("../controllers/roomController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
router.post('/create', auth_1.authenticateToken, (req, res, next) => {
    (0, roomController_1.createRoom)(req, res).catch(next);
});
router.post('/join/:roomId', auth_1.authenticateToken, (req, res, next) => {
    (0, roomController_1.joinRoom)(req, res).catch(next);
});
router.get('/public', (req, res, next) => {
    (0, roomController_1.listPublicRooms)(req, res).catch(next);
});
router.get('/user', auth_1.authenticateToken, (req, res, next) => {
    (0, roomController_1.listUserRooms)(req, res).catch(next);
});
exports.default = router;
//# sourceMappingURL=roomRoutes.js.map