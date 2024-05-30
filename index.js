import { OAuthApp } from "octokit";
import express from 'express';
import cors from 'cors'
import 'dotenv/config'

const app = express();

const PORT = process.env.PORT || 8080;
app.use(express.json());
app.use(cors());

const clientId = process.env.CLIENT_ID
const clientSecret = process.env.CLIENT_SECRET

const oAuthApp = new OAuthApp({
  clientId,
  clientSecret,
  defaultScopes: ['repo']
});

app.get('/', (req, res) => {
  res.send('server is running...');
});

app.post('/access-token', async (req, res) => {
  const { code, state, accessToken } = req.body
  try {
    const token = await oAuthApp.createToken({ code, state })
    res.json(token)
  } catch (error) {
    const token = await oAuthApp.resetToken({ token: accessToken })
    res.json(token)
  }
});

app.post('/logout', async (req, res) => {
  const { accessToken } = req.body
  try {
    const token = await oAuthApp.deleteToken({ token: accessToken })
    res.json(token)
  } catch (error) {
    res.json(error)
  }
});

app.listen(PORT, () => {
  console.log('Server is listenin on PORT :' + PORT);
})
