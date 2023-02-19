import { Voter, Token, generateMongoObjectId } from '../models/model-config.js'
import { voterSchema } from './validator.js'

const genToken = () => `${Math.random().toString(36).substr(4)}`;

const _create = async (req, res) => {

  const { error, value } = voterSchema.validate(req.body, { abortEarly: false })
  if (error) return res.status(400)
    .json({ ok: false, msg: error.message })
  const {reg_nos} = value
  // return console.log(reg_nos)
  const bulk_voters = []
  const tokens = []
  try {
    for(let item of reg_nos) {
      tokens.push({_token:genToken()})
      bulk_voters.push({_id:generateMongoObjectId() ,reg_no:item})
    };
    // console.log(tokens)
    // console.log(bulk_voters)

    await Voter.bulkCreate(bulk_voters)
    await Token.bulkCreate(tokens)
  } catch(e) {
    console.log(e);
    if (e.errors[0]?.validatorKey === 'not_unique') {
      return res.json({ ok: false, msg: e.errors[0].message })
    }
    return res.status(500).json({ ok: false, msg: "An error occoured", err:e.message })
  }
  res.json({ ok: true, msg: "Voters created sucssfully", tokens, voters:bulk_voters })
}

const _fetch = async (req, res) => {
  const voters = await Voter.findAll({ where: { } })
  res.status(200).json({ ok: true, voters })
}

export default { _create, _fetch }