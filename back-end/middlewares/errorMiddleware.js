import ErrorHandler from "../utils/ErrorHandler.js";
const errorMiddleware = (err, req, res, next) => {
    console.log("err in errorMiddleware:", err, "error name:", err.name, err.code)
    let error = { // this is initialize error object
        statusCode: err.statusCode || 500,
        message: err.message || "Internal Server Error"
    }
    // Handle Invalid Mongoose ID error
    if (err.name === "CastError") {
        const message = `Resource not found. Invalid: ${err.path}`;
        error = new ErrorHandler(message, 404)  // when response come back from ErrorHandler we overwride initialize error object
    }
    // Handle Validation error
    if (err.name === "ValidationError") {
        const message = Object.values(err.errors).map((value) => value.message);
        error = new ErrorHandler(message, 400)
    }
    // Handle Mongoose Duplicate key error
    if (err.name === 11000) {
        const message = `Duplicate ${Object.keys(err.keyValue)} entered`
        error = new ErrorHandler(message, 400)
    }
    // Handle wrong JWT error
    if (err.name === "JsonWebToken") {
        const message = "Json web token is Invalid try again"
        error = new ErrorHandler(message, 400)
    }
    if (err.name === "TokenExpiredError") {
        const message = "Json web token is Expired try again"
        error = new ErrorHandler(message, 404)
    }
    if (process.env.NODE_ENV === "DEVELOPMENT") {
        res.status(error.statusCode).json({
            message: error.message,
            error: err,
            stack: err.stack
        })
    }
    if (process.env.NODE_ENV === "PRODUCTION") {
        res.status(error.statusCode).json({
            message: error.message,
        })
    }
}
export default errorMiddleware