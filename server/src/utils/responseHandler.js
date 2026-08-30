const responseHandler = {
  success: (res, data, message = 'Success', statusCode = 200) => {
    return res.status(statusCode).json({
      success: true,
      message,
      data,
    });
  },

  error: (res, message = 'Error', statusCode = 500, data = null) => {
    return res.status(statusCode).json({
      success: false,
      message,
      data,
    });
  },

  created: (res, data, message = 'Created successfully') => {
    return res.status(201).json({
      success: true,
      message,
      data,
    });
  },

  notFound: (res, message = 'Resource not found') => {
    return res.status(404).json({
      success: false,
      message,
    });
  },

  badRequest: (res, message = 'Bad request') => {
    return res.status(400).json({
      success: false,
      message,
    });
  },

  unauthorized: (res, message = 'Unauthorized') => {
    return res.status(401).json({
      success: false,
      message,
    });
  },

  forbidden: (res, message = 'Forbidden') => {
    return res.status(403).json({
      success: false,
      message,
    });
  },
};

module.exports = responseHandler;
