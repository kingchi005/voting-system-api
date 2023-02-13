import express from 'express'
const router = express.Router()
import authController from '../controllers/authController.js'
import { requireVoterAuth } from '../controllers/middlewares.js'


router.post("/login-voter", authController.login_voter)

router.get("/logout-voter", requireVoterAuth, function welcome(req, res) {
  res.json({ ok: true, msg: "voter you just logged out" })
})

router.post("/login-admin", authController.login_admin)

router.get("/logout-admin", function welcome(req, res) {
  res.json({ ok: true, msg: "admin you are logged out" })
})

export default router