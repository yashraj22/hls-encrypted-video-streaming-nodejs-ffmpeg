import type { Request, Response, NextFunction } from "express";
import { auth } from "../config/auth.ts";
import User from "../models/User.ts";
import Enrollment from "../models/Enrollment.ts";

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    name: string;
    role: "student" | "instructor" | "admin";
  };
}

export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const session = await auth.api.getSession({
      headers: req.headers as any,
    });

    // if (!session) {
    //   res.status(401).json({ message: "Authentication required" });
    //   return;
    // }

    // const user = await User.findById(session.user.id);

    // if (!user || !user.isActive) {
    //   res.status(401).json({ message: "User not found or inactive" });
    //   return;
    // }

    // req.user = {
    //   id: (user._id as any).toString(),
    //   email: user.email,
    //   name: user.name,
    //   role: user.role,
    // };

    next();
  } catch (error) {
    console.error("Authentication error:", error);
    res.status(500).json({ message: "Authentication failed" });
  }
};

export const authorize = (roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    // if (!req.user) {
    //   res.status(401).json({ message: "Authentication required" });
    //   return;
    // }

    if (!req.user || !roles.includes(req.user.role)) {
      res.status(403).json({ message: "Insufficient permissions" });
      return;
    }

    next();
  };
};

export const checkCourseAccess = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { courseId } = req.params;
    const userId = req.user?.id;

    // if (!userId) {
    //   res.status(401).json({ message: "Authentication required" });
    //   return;
    // }

    // Check if user is enrolled in the course
    const enrollment = await Enrollment.findOne({
      student: userId,
      course: courseId,
      isActive: true,
    });

    if (!enrollment) {
      res.status(403).json({ message: "Course access denied" });
      return;
    }

    next();
  } catch (error) {
    console.error("Course access check error:", error);
    res.status(500).json({ message: "Access check failed" });
  }
};

export const checkLessonAccess = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { lessonId } = req.params;
    const userId = req.user?.id;

    // if (!userId) {
    //   res.status(401).json({ message: "Authentication required" });
    //   return;
    // }

    // Get lesson and check course enrollment
    const lesson = await Enrollment.aggregate([
      {
        $lookup: {
          from: "lessons",
          localField: "course",
          foreignField: "course",
          as: "lessons",
        },
      },
      {
        $match: {
          student: userId,
          isActive: true,
          "lessons._id": lessonId,
        },
      },
    ]);

    if (!lesson.length) {
      res.status(403).json({ message: "Lesson access denied" });
      return;
    }

    next();
  } catch (error) {
    console.error("Lesson access check error:", error);
    res.status(500).json({ message: "Access check failed" });
  }
};
