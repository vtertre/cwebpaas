const CWebp = require('cwebp').CWebp;
const express = require('express');

const supportedContentTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];

const app = express();
const port = parseInt(process.env.PORT, 10) || 3000;

app.use((request, response, next) => {
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.options('/', (_, response) => {
  response.sendStatus(204);
});

app.get('/', (request, response) => {
  response.send('OK');
});

app.options('/convert', (_, response) => {
  response.sendStatus(204);
});

app.post('/convert', async (request, response) => {
  const isInvalidContentType = !supportedContentTypes.includes(request.headers['content-type']);
  if (isInvalidContentType) {
    return response.status(400).send('Allowed formats: PNG, JPG/JPEG, WebP.');
  }

  const sizeParam = request.query.size;
  const size = sizeParam ? parseInt(sizeParam, 10) : undefined;

  if (sizeParam && (isNaN(size) || size <= 0)) {
    return response.status(400).send('Invalid size parameter.');
  }

  try {
    const cwebpEncoder = new CWebp(request);

    if (size) {
      cwebpEncoder.size(size);
    }

    const encodingStream = cwebpEncoder.stream();

    encodingStream.on('error', () => {
      response.status(500).send('WebP conversion failed.');
    });

    response.setHeader('Content-Type', 'image/webp');
    encodingStream.pipe(response);
  } catch {
    response.status(500).send('Internal server error.');
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
