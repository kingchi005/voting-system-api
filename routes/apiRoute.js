import express from 'express'
import aspirantController from '../controllers/aspirantController.js'
import pollController from '../controllers/pollController.js'
// import { requireVoterAuth } from '../controllers/middlewares.js'

const router = express.Router()


router.get("/fetch-aspirants", aspirantController._fetch)
router.get("/index", aspirantController._fetch_index)
router.post("/create-vote/:id", pollController._create)

export default router