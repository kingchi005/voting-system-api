import express from 'express'
import officeController from '../controllers/officeController.js'
import aspirantController from '../controllers/aspirantController.js'
import pollController from '../controllers/pollController.js'
import voterController from '../controllers/voterController.js'
import adminController from '../controllers/adminController.js'

const router = express.Router()

router.get("/fetch-aspirants", aspirantController._fetch)
router.put("/end-voting", adminController._end_voting)
router.put("/commence-voting", adminController._start_voting)
router.get("/election-status", adminController._fetch_election_status)

router.get("/create-aspirant", aspirantController._create)
router.post("/create-aspirant", aspirantController._create)
router.patch("/update-aspirant/:id", aspirantController._update)
router.delete("/delete-aspirant/:id", aspirantController._delete)

router.get("/fetch-result", pollController._fetch_result)
router.get("/fetch-poll", pollController._fetch)

router.get("/fetch-office", officeController._fetch)
router.post("/create-office", officeController._create)
router.patch("/update-office/:id", officeController._update)
router.delete("/delete-office/:id", officeController._delete)

router.post("/register-voters", voterController._create)
router.get("/fetch-voters", voterController._fetch)
router.get("/fetch-tokens", adminController._fetch_tokens)

export default router