import { Response } from "express";

export interface AppError extends Error {
  statusCode?: number;
  code?: string;
}

export const handleError = (error: any, res: Response) => {
  console.error("Error:", error);

  // Handle Prisma errors
  if (error.code === "P2002") {
    return res.status(409).json({
      error: "Resource already exists",
      details: "This resource already exists in the database",
    });
  }

  if (error.code === "P2025") {
    return res.status(404).json({
      error: "Resource not found",
      details: "The requested resource was not found",
    });
  }

  // Handle validation errors
  if (error.name === "ValidationError") {
    return res.status(400).json({
      error: "Validation failed",
      details: error.message,
    });
  }

  // Handle authentication errors
  if (error.statusCode === 401) {
    return res.status(401).json({
      error: "Authentication failed",
      details: error.message,
    });
  }

  if (error.statusCode === 403) {
    return res.status(403).json({
      error: "Access denied",
      details: error.message,
    });
  }

  // Default error response
  return res.status(500).json({
    error: "Internal server error",
    details:
      process.env.NODE_ENV === "development"
        ? error.message
        : "Something went wrong",
  });
};

export const createError = (
  message: string,
  statusCode: number = 500
): AppError => {
  const error = new Error(message) as AppError;
  error.statusCode = statusCode;
  return error;
};
