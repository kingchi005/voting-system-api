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
import sequelize from './models/model-config.js'
import { requireVoterAuth, requireAdminAuth, checkVotingCommenced } from './controllers/middlewares.js'


const app = express()

app.use(express.static('public'));
app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(cookieParser());
app.use(cors());
// app.set('view engine', 'html');
app.listen(process.env.PORT, () => console.log("serving ..."))

/*app.get('/', (req, res) => {
  res.render('build/index.html')
})
*/
app.use('/auth', checkVotingCommenced, authRoute)
app.use('/api', checkVotingCommenced, /*requireVoterAuth,*/ apiRoute)
app.use('/admin', /*requireAdminAuth,*/ adminRoute)

// error 404
app.use((req, res) => {
  let fullUrl = req.method + ': ' + req.protocol + '://' + req.get('host') + req.originalUrl;
  console.log(fullUrl);
  res.status(404)
    .json({ error: 404, msg: 'page not found', url: fullUrl })
})

/*app.use(bodyParser.json({
  limit: '50mb'
}));

app.use(bodyParser.urlencoded({
  limit: '50mb',
  parameterLimit: 100000,
  extended: true 
}));
Source:github.com
10
base64 PayloadTooLargeError: request entity too largeJavascript By Pudochu on Nov 14 2022 ThankCommentSuggest EditShare
// SERVER:
const bodyParser = require('body-parser')

var jsonParser = bodyParser.json({limit:1024*1024*10, type:'application/json'}); 
var urlencodedParser = bodyParser.urlencoded({ extended:true,limit:1024*1024*10,type:'application/x-www-form-urlencoded' });

app.use(jsonParser);
app.use(urlencodedParser);

//external:
app.use(bodyParser.urlencoded({extended: true}));*/