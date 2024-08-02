

### Commands
```bash
npm init -y
npm install express cookie-parser jsonwebtoken google-auth-library cors axios
```

### Modify package.json
Add the following line to your package.json file to set up the start script:
```json
"start": "node server.js"
```


### Run
To start the server, use one of the following methods:
```bash
# npm
npm start

# docker
docker biuild . -t backend:latest 
docker run -p 5000:5000 backend:latest
```