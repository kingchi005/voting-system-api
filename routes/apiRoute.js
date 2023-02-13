import express from 'express'
import aspirantController from '../controllers/aspirantController.js'
import pollController from '../controllers/pollController.js'
import { requireVoterAuth } from '../controllers/middlewares.js'

const router = express.Router()


router.get("/fetch-aspirants", requireVoterAuth, aspirantController._fetch)

router.post("/create-vote/:id", requireVoterAuth, pollController._create)

export default router