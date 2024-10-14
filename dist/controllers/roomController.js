"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.listUserRooms = exports.listPublicRooms = exports.joinRoom = exports.createRoom = void 0;
const prisma_1 = __importDefault(require("../lib/prisma"));
const createRoom = async (req, res) => {
    var _a;
    try {
        const { name, isPublic } = req.body;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }
        const newRoom = await prisma_1.default.room.create({
            data: {
                name,
                isPublic,
                owner: { connect: { id: userId } },
                participants: { connect: { id: userId } },
            },
        });
        res.status(201).json(newRoom);
    }
    catch (error) {
        res.status(500).json({ message: 'Error creating room', error });
    }
};
exports.createRoom = createRoom;
const joinRoom = async (req, res) => {
    var _a;
    try {
        const { roomId } = req.params;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }
        const room = await prisma_1.default.room.update({
            where: { id: parseInt(roomId) },
            data: {
                participants: { connect: { id: userId } },
            },
        });
        res.json(room);
    }
    catch (error) {
        res.status(500).json({ message: 'Error joining room', error });
    }
};
exports.joinRoom = joinRoom;
const listPublicRooms = async (req, res) => {
    try {
        const publicRooms = await prisma_1.default.room.findMany({
            where: { isPublic: true },
            include: { _count: { select: { participants: true } } },
        });
        res.json(publicRooms);
    }
    catch (error) {
        res.status(500).json({ message: 'Error listing public rooms', error });
    }
};
exports.listPublicRooms = listPublicRooms;
const listUserRooms = async (req, res) => {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }
        const userRooms = await prisma_1.default.room.findMany({
            where: {
                participants: { some: { id: userId } },
            },
            include: { _count: { select: { participants: true } } },
        });
        res.json(userRooms);
    }
    catch (error) {
        res.status(500).json({ message: 'Error listing user rooms', error });
    }
};
exports.listUserRooms = listUserRooms;
//# sourceMappingURL=roomController.js.map