import express from 'express'
const router = express.Router()
import authController from '../controllers/authController.js'
import { requireVoterAuth,checkVotingCommenced } from '../controllers/middlewares.js'


router.post("/login-voter", checkVotingCommenced, authController.login_voter)
router.get("/logout-voter", requireVoterAuth, authController.logout_voter)


router.post("/login-admin", authController.login_admin)

router.get("/logout-admin", function welcome(req, res) {
  res.json({ ok: true, msg: "admin you are logged out" })
})

export default router