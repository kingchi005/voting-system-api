import { Office, generateMongoObjectId } from '../models/model-config.js'

const _create = async (req, res) => {

  const { name } = req.body
  if (!name) return res.status(401)
    .json({ ok: false, msg: "Office name is required" })
  try {
    const created = await Office.create({ name, _id:generateMongoObjectId() })
    return res.status(200)
      .json({ ok: true, msg: 'Office created successfully' })
  } catch (e) {
    // console.log(e.errors[0].validatorKey);
    if (e.errors[0].validatorKey === 'not_unique') {
      return res.json({ ok: false, msg: e.errors[0].message })
    }
    return res.status(505)
      .json({ ok: false, msg: 'An error occoured' })
  }

}

const _delete = async (req, res) => {
  const _id = req.params.id
  const office = await Office.findOne({ where: { _id, deleted_flag: false } })
  // return console.log(office);
  if (!office) return res.status(404)
    .json({ ok: false, msg: "Office not found" })
  try {
    const updated = await Office.update({ deleted_flag: true, name:'---' }, { where: { _id } })
    return res.status(200)
      .json({ ok: true, msg: 'Office deleted successfully' })
  } catch (e) {
    console.log(e);
    return res.status(505)
      .json({ ok: true, msg: 'An error occoured', err: e.message })
  }
}

const _fetch = async (req, res) => {
  const offices = await Office.findAll({ where: { deleted_flag: false } })
  res.status(200)
    .json({ ok: true, offices })
}

export default { _create, _fetch, _delete }