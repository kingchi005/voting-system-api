import express from 'express'
const router = express.Router()
import pollController from '../controllers/pollController.js'
import authController from '../controllers/authController.js'
import { requireVoterAuth } from '../controllers/middlewares.js'


router.get('/:id/:name/vote', requireVoterAuth, pollController.index);
router.get('/login-voter', (req, res)=>{
	res.render('login')
});

export default router

