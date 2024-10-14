import { Response } from 'express';
import prisma from '../lib/prisma';
import { AuthRequest } from '../middleware/auth';
import { io } from '../server'; // You'll need to export io from server.ts

export const createRoom = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, isPublic } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const newRoom = await prisma.room.create({
      data: {
        name,
        isPublic,
        owner: { connect: { id: userId } },
        participants: { connect: { id: userId } },
      },
    });

    res.status(201).json(newRoom);
  } catch (error) {
    res.status(500).json({ message: 'Error creating room', error });
  }
};

export const joinRoom = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { roomId } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const room = await prisma.room.update({
      where: { id: parseInt(roomId) },
      data: {
        participants: { connect: { id: userId } },
      },
    });

    res.json(room);
  } catch (error) {
    res.status(500).json({ message: 'Error joining room', error });
  }
};

export const listPublicRooms = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const publicRooms = await prisma.room.findMany({
      where: { isPublic: true },
      include: { _count: { select: { participants: true } } },
    });

    res.json(publicRooms);
  } catch (error) {
    res.status(500).json({ message: 'Error listing public rooms', error });
  }
};

export const listUserRooms = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const userRooms = await prisma.room.findMany({
      where: {
        participants: { some: { id: userId } },
      },
      include: { _count: { select: { participants: true } } },
    });

    res.json(userRooms);
  } catch (error) {
    res.status(500).json({ message: 'Error listing user rooms', error });
  }
};

export const sendMessage = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { roomId, content, language } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const message = await prisma.message.create({
      data: {
        content,
        userId,
        roomId: parseInt(roomId),
        language,
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    });

    // Emit the message to all users in the room
    io.to(roomId).emit('receive_message', message);

    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ message: 'Error sending message', error });
  }
};
