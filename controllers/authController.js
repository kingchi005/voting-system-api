import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { login_voterSchema, login_adminSchema } from './validator.js'
import { Voter, Token, Admin } from '../models/model-config.js'

const maxAge = 1 * 60 * 60;
const createVoterToken = id => jwt.sign({ id }, process.env.secreTokenKey, { expiresIn: maxAge });
const createAdminToken = id => jwt.sign({ id }, process.env.secreTokenKeyForAdmin, { expiresIn: maxAge });


const login_voter = async (req, res) => {

  let errors = {}
  const { error, value } = login_voterSchema.validate(req.body, { abortEarly: false })
  if (error) {
    error.details.forEach(properties => {
      errors[properties.path] = properties.message;
    })
    return res.status(400).json({ ok: false, errors })
  }

  const { reg_no, _token } = value;

  const voter = await Voter.findOne({ where: { reg_no } })
  if (!voter) return res.status(401).json({ ok: false, msg: "Unregistered voter" })

  // verify hash
  // const authenticUser = await bcrypt.compare(_token, '_token from _token');
  const authenticToken = await Token.findOne({ where: { _token } })
  if (!authenticToken) return res.status(400).json({ ok: false, msg: "Invalid Token" })
  if (authenticToken.isUsed) return res.status(400).json({ ok: false, msg: "Used Token" })
  // if (!voter.logged_in) return res.status(400).json({ ok: false, msg: "You are logged in already" })
  if (voter.voted) return res.status(400).json({ ok: false, msg: "Login not allowed since you have voted already." })

  try {
    Voter.update({ logged_in: true }, { where: { id: voter.id } })
    Token.update({ isUsed: true }, { where: { _token } })
    const token = createVoterToken(voter._id);
    res.cookie('_x_ray_mo_', token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(200).json({ ok: true, msg: 'Login successful', voter: voter._id });
  } catch (e) {
    res.status(200).json({ ok: false, msg: 'An error occured', err: e.message });
  }
}

const login_admin = async (req, res) => {

  let errors = {}
  const { error, value } = login_adminSchema.validate(req.body, { abortEarly: false })
  if (error) {
    error.details.forEach(properties => {
      errors[properties.path] = properties.message;
    })
    return res.status(400).json({ ok: false, errors })
  }

  const { pass_name, pass_token } = value;
  // console.log(value)

  const admin = await Admin.findOne({ where: { pass_name, pass_token, isActive: true } })
  if (!admin) return res.status(401).json({ ok: false, msg: "You are not authorised here" })

  try {
    const token = createAdminToken(admin.pass_token);
    // res.cookie('_x__r_a_y__m_u_m_m_y_', token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(200).json({ ok: true, msg: 'Login successful', token });
  } catch (e) {
    res.status(200).json({ ok: false, msg: 'An error occured', err: e.message });
  }
}

const logout_voter = (req, res) => {
  res.cookie('_x_ray_mo_', 'log out succefful', {maxAge: 1});
  res.redirect('/v1.0/login-voter');
};
export default { login_voter, login_admin, logout_voter }