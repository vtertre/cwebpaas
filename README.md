# cwebpaas

## curl example

```bash
curl \
  -X POST \
  -H "Content-Type: image/png" \
  --data-binary "@file.png" \
  --output out.webp \
  "http://localhost:3000/convert?size=40000"
```
