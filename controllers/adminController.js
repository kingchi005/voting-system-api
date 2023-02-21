import { Admin, Token } from '../models/model-config.js'

const _create = (req, res) => {
  res.json({ ok: true, msg: "created now" })
}

const _fetch = (req, res) => {
  res.json({ ok: true, msg: "fetched now" })
}

const _fetch_tokens = async (req, res) => {
  const tokens = await Token.findAll()
  res.json({ ok: true, msg: "fetched now", tokens })
};

const _fetch_election_status = async (req, res) => {
  const status = await Admin.findOne({ where: { pass_name: 'kingchi' } })
  res.json({ ok: true, status: status.votingCommenced })
};

const _start_voting = async (req, res) => {

  const admin = await Admin.findOne({ where: { pass_name: 'kingchi' } })
  if (admin.votingCommenced) return res.json({ ok: true, msg: "Voting process has already commenced" })
  const started = Admin.update({ votingCommenced: true }, { where: { pass_name: 'kingchi' } })
  res.json({ ok: true, msg: "Voting process commenced now" })
}

const _end_voting = async (req, res) => {

  const admin = await Admin.findOne({ where: { pass_name: 'kingchi' } })
  if (!admin.votingCommenced) return res.json({ ok: true, msg: "Voting process has already ended" })
  const started = Admin.update({ votingCommenced: false }, { where: { pass_name: 'kingchi' } })
  res.json({ ok: true, msg: "Voting process ended now" })
}

export default { _create, _fetch, _start_voting, _end_voting, _fetch_tokens, _fetch_election_status }