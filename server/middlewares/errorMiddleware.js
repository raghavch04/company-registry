import { StatusCodes } from 'http-status-codes';

const errorMiddleware = (err, req, res, next) => {
  console.error(err.stack);

  const statusCode = err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
  const message = err.message || 'Something went wrong';

  res.status(statusCode).json({
    success: false,
    message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
};

export default errorMiddleware;