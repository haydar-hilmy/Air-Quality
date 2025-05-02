const logMiddleware = (req, res, next) => {
  const time = new Date().toISOString();
  console.log(`[${time}] Path: ${req.path} | URL: ${req.originalUrl}`);
  next();
};

export default logMiddleware;
