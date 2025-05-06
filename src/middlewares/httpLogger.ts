import { Request, Response, NextFunction } from 'express';
import pinoHttp from 'pino-http';
import logger from '../utils/logger';

const pinoHttpInstance = pinoHttp({
  logger,
  customLogLevel(req, res, err) {
    if (res.statusCode >= 500 || err) return 'error';
    if (res.statusCode >= 400) return 'warn';
    return 'info';
  },
  redact: {
    paths: ['req.headers.authorization', 'req.headers.cookie'],
    remove: true,
  },
  serializers: {
    req(req) {
      return {
        method: req.method,
        url: req.url,
        params: req.params,
        query: req.query,
        body: req.body && {
          ...(req.body.code && { code: req.body.code }),
          ...(req.body.name && { name: req.body.name }),
          ...(req.body.name_ar && { name_ar: req.body.name_ar }),
        },
      };
    },
    res(res) {
      return {
        statusCode: res.statusCode,
      };
    },
  },
});

// 🧼 Wrapper to skip noisy paths
export function httpLogger(req: Request, res: Response, next: NextFunction) {
  const ignoredPaths = ['/favicon.ico', '/health'];
  if (ignoredPaths.includes(req.path)) {
    return next();
  }

  return pinoHttpInstance(req, res, next);
}
