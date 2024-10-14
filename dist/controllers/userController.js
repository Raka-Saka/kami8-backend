"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.signup = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const prisma_1 = __importDefault(require("../lib/prisma"));
const signup = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        // Check if user already exists
        const existingUser = await prisma_1.default.user.findFirst({
            where: {
                OR: [
                    { email },
                    { username }
                ]
            }
        });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }
        // Hash password
        const salt = await bcryptjs_1.default.genSalt(10);
        const hashedPassword = await bcryptjs_1.default.hash(password, salt);
        // Create new user
        const newUser = await prisma_1.default.user.create({
            data: {
                username,
                email,
                password: hashedPassword
            }
        });
        // Create token
        const token = jsonwebtoken_1.default.sign({ id: newUser.id }, process.env.JWT_SECRET, {
            expiresIn: '1h'
        });
        res.status(201).json({ token, user: { id: newUser.id, username: newUser.username, email: newUser.email } });
    }
    catch (error) {
        res.status(500).json({ message: 'Error signing up', error });
    }
};
exports.signup = signup;
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        // Find user
        const user = await prisma_1.default.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }
        // Check password
        const isPasswordValid = await bcryptjs_1.default.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Invalid password' });
        }
        // Create token
        const token = jsonwebtoken_1.default.sign({ id: user.id }, process.env.JWT_SECRET, {
            expiresIn: '1h'
        });
        res.json({ token, user: { id: user.id, username: user.username, email: user.email } });
    }
    catch (error) {
        res.status(500).json({ message: 'Error logging in', error });
    }
};
exports.login = login;
//# sourceMappingURL=userController.js.map