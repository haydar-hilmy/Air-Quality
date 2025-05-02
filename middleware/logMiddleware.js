const logMiddleware = (req, res, next) => {
  const time = new Date().toISOString();
  const method = req.method;
  const path = req.path;
  const url = req.originalUrl;

  console.log(`[${time}] ${method} | Path: ${path} | URL: ${url}`);
  next();
};

export default logMiddleware;
