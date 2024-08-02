const express = require('express');
const axios = require('axios');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');

const app = express();
const port = 5000;
const front_uri = 'http://localhost:3000';

const JWT_SECRET = 'your_jwt_secret_key';

const CLIENT_ID = 'client_id';
const CLIENT_SECRET = 'client_secret';
const REDIRECT_URI = front_uri;

const client = new OAuth2Client(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);

const cors = require('cors');

app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: front_uri, credentials: true }));

// middleware
function authenticateToken(req, res, next) {
  const token = req.cookies.jwt;
  if (!token) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET, (err, user) => {
      if (err) return res.sendStatus(403);
      req.user = user;
      next();
  });
}

app.post('/auth/google', async (req, res) => {
  const { code } = req.body;

  try {
    const { tokens } = await client.getToken({
      code,
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      redirect_uri: REDIRECT_URI,
    });

    const ticket = await client.verifyIdToken({
      idToken: tokens.id_token,
      audience: CLIENT_ID,
    });

    const payload = ticket.getPayload();

    const response = await axios.get(`https://oauth2.googleapis.com/tokeninfo?id_token=${tokens.id_token}`);
    const profile = {
      name: response.data.name,
      email: response.data.email,
      picture: response.data.picture,
    };

    const jwtToken = jwt.sign({ id: payload.sub, name: profile.name, email: profile.email, picture: profile.picture }, JWT_SECRET, { expiresIn: '1h' });
    
    res.cookie('jwt', jwtToken, { httpOnly: true, secure: true, sameSite: 'None' });
    res.json({ message: 'Logged in', profile : profile });
  } catch (error) {
      console.error('Error verifying token:', error);
      res.status(400).json({ error: 'Invalid Google token' });
  }
});

app.get('/profile', (req, res) => {
  const token = req.cookies.jwt;
  
  console.log("profile log (token): ", token );
  
  if (!token) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }

    const profile = {
      name: user.name,
      email: user.email,
      picture: user.picture,
    };

    console.log("profile log (profile) : ", profile );

    res.json(profile);
  });
});

app.post('/logout', (req, res) => {
  res.clearCookie('jwt');
  res.json({ message: 'Logged out' });
});

app.get('/protected', authenticateToken, (req, res) => {
  res.json({ message: 'This is a protected route', user: req.user });
});

app.get('/', (req, res) => {
  res.json({ message: 'This is a public route' });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
