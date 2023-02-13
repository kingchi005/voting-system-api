import express from 'express'
import officeController from '../controllers/officeController.js'
import aspirantController from '../controllers/aspirantController.js'
import pollController from '../controllers/pollController.js'
import voterController from '../controllers/voterController.js'
import { requireAdminAuth } from '../controllers/middlewares.js'

const router = express.Router()

router.post("/create-aspirant",  /*requireAdminAuth,*//* upload, handleUploadErr,*/ aspirantController._create)
router.delete("/delete-aspirant/:id", requireAdminAuth, aspirantController._delete)
router.get("/fetch-result", requireAdminAuth, pollController._fetch_result)
router.get("/fetch-poll", requireAdminAuth, pollController._fetch)
router.get("/fetch-office", requireAdminAuth, officeController._fetch)
router.post("/create-office", requireAdminAuth, officeController._create)
router.delete("/delete-office/:id", requireAdminAuth, officeController._delete)
router.post("/register-voters", requireAdminAuth, voterController._create)
router.get("/fetch-voters", requireAdminAuth, voterController._fetch)

export default router