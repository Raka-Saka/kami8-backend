import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcryptjs from 'bcryptjs';

// This is a mock user database. In a real application, you'd use a proper database.
let users: { id: number; username: string; email: string; password: string }[] = [];

export const signup = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;
    
    // Check if user already exists
    if (users.find(user => user.email === email)) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    // Create new user
    const newUser = {
      id: users.length + 1,
      username,
      email,
      password: hashedPassword
    };

    users.push(newUser);

    // Create token
    const token = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET as string, {
      expiresIn: '1h'
    });

    res.status(201).json({ token, user: { id: newUser.id, username: newUser.username, email: newUser.email } });
  } catch (error) {
    res.status(500).json({ message: 'Error signing up', error });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = users.find(user => user.email === email);
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    // Check password
    const isPasswordValid = await bcryptjs.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid password' });
    }

    // Create token
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET as string, {
      expiresIn: '1h'
    });

    res.json({ token, user: { id: user.id, username: user.username, email: user.email } });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error });
  }
};
