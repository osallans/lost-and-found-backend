// src/docs/swagger.ts
export const swaggerDocument = {
    openapi: '3.0.0',
    info: {
      title: 'Lost & Found API',
      version: '1.0.0',
    },
    servers: [{ url: '/api' }],
    paths: {
      '/countries': {
        get: {
          summary: 'List all countries',
          responses: {
            200: {
              description: 'Array of countries',
            },
          },
        },
        post: {
          summary: 'Create a country',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    code: { type: 'string', example: 'US' },
                    name: { type: 'string', example: 'United States' },
                    name_ar: { type: 'string', example: 'الولايات المتحدة' },
                  },
                  required: ['code', 'name'],
                },
              },
            },
          },
          responses: {
            201: { description: 'Country created' },
            400: { description: 'Invalid input' },
          },
        },
      },
      '/countries/{code}': {
        get: {
          summary: 'Get a country by code',
          parameters: [
            {
              name: 'code',
              in: 'path',
              required: true,
              schema: { type: 'string' },
            },
          ],
          responses: {
            200: { description: 'Found' },
            404: { description: 'Not found' },
          },
        },
        put: {
          summary: 'Update a country',
          parameters: [{ name: 'code', in: 'path', required: true, schema: { type: 'string' } }],
          requestBody: {
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    name: { type: 'string' },
                    name_ar: { type: 'string' },
                  },
                },
              },
            },
          },
          responses: {
            200: { description: 'Updated' },
            404: { description: 'Not found' },
          },
        },
        delete: {
          summary: 'Delete a country',
          parameters: [{ name: 'code', in: 'path', required: true, schema: { type: 'string' } }],
          responses: {
            200: { description: 'Deleted' },
            404: { description: 'Not found' },
          },
        },
      },
    },
  };
  