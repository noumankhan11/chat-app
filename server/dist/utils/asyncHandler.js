import { ApiError } from "./ApiError.js";
export const asyncHandler = (fn) => {
    return async (req, res, next) => {
        try {
            await fn(req, res, next);
        }
        catch (error) {
            // Handle the error and return a proper response
            res.status(error.statusCode || 500).json(new ApiError(error.statusCode || 500, "Oops! something went wrong", [error.message], // Populate the errors array
            error.stack // You can include stack trace for debugging (optional)
            ));
        }
    };
};
export default asyncHandler;
