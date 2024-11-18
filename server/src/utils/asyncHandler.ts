import { Request, Response, NextFunction } from "express";
import { ApiError } from "./ApiError.js";

// export const asyncHandler = (
//   requestHandler: (
//     req: Request,
//     res: Response,
//     next: NextFunction
//   ) => Promise<any>
// ) => {
//   return (req: Request, res: Response, next: NextFunction) => {
//     Promise.resolve(requestHandler(req, res, next)).catch((err) =>
//       next(err)
//     );
//   };
// };

// Define the type for the async handler function
type AsyncHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<any>;

export const asyncHandler = (fn: AsyncHandler) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await fn(req, res, next);
    } catch (error: any) {
      // Handle the error and return a proper response

      res.status(error.statusCode || 500).json(
        new ApiError(
          error.statusCode || 500,
          "Oops! something went wrong",
          [error.message], // Populate the errors array
          error.stack // You can include stack trace for debugging (optional)
        )
      );
    }
  };
};

export default asyncHandler;
