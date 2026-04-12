import z, { ZodError } from "zod";

const errorHandler = (err, req, res, next) => {
  let statusCode = res.statusCode !== 200 ? res.statusCode : 500;
  let message = err.message || "Internal Server Error";

  if (err instanceof ZodError) {
    statusCode = 400;
    message = err.issues[0].message;
  }

  res.status(statusCode).json({
    success: false,
    message: message,
  });
};

export default errorHandler;
