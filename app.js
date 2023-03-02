"use strick"
import express from 'express'
import cookieParser from 'cookie-parser'
import * as dotenv from 'dotenv'
import cors from 'cors'
dotenv.config()
// Routes
import adminRoute from './routes/adminRoute.js'
import apiRoute from './routes/apiRoute.js'
import authRoute from './routes/authRoute.js'
import voteRoute from './routes/voteRoute.js'
import sequelize from './models/model-config.js'
import { requireVoterAuth, requireAdminAuth, checkVotingCommenced } from './controllers/middlewares.js'
import pollController from './controllers/pollController.js'


const app = express()

app.use(express.static('public'));
app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(cookieParser());
app.use(cors());
// app.set('view engine', 'html');
app.listen(process.env.PORT, () => console.log("serving ..."))

app.set('view engine', 'ejs');

/*app.get('/', (req, res) => {
  res.render('build/index.html')
})
*/
app.use('/auth', authRoute)
app.use('/api', checkVotingCommenced, /*requireVoterAuth,*/ apiRoute)
app.use('/admin', requireAdminAuth, adminRoute)
app.use('/v1.0', voteRoute);
// error 404
app.use((req, res) => {
  let fullUrl = req.method + ': ' + req.protocol + '://' + req.get('host') + req.originalUrl;
  console.log(fullUrl);
  res.status(404)
    .json({ error: 404, msg: 'page not found', url: fullUrl })
})