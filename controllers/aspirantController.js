import multer from 'multer'
import { aspirantSchema } from './validator.js'
import { Aspirant, generateMongoObjectId, Office } from '../models/model-config.js'
// import { avatar_name, upload } from './middlewares.js'


const _create = async (req, res) => {
  // console.log(req.body)res
 /* const { error, value } = aspirantSchema.validate(req.body, { abortEarly: false })
  if (error) return res.status(400)
    .json({ ok: false, msg: error.message })

  let asp_available = await Office.findOne({ where: { id: value.office_id, deleted_flag: false } })
  if (!asp_available) return res.status(404).json({ ok: false, msg: 'Selected office is not availavle' })

  try {
    value._id = generateMongoObjectId()
    value.avatar = avatar_name_
    const done = await Aspirant.create(value)
    return res.status(200)
      .json({ ok: true, msg: 'Aspirant created successfully' })
  } catch (e) {
    console.log(e)
    if (e.errors[0]?.validatorKey === 'not_unique') {
      return res.json({ ok: false, msg: e.errors[0].message })
    }
    return res.status(505)
      .json({ ok: false, msg: 'An error occoured', err: e.message })
  }*/
}

const _delete = async (req, res) => {
  const _id = req.params.id
  const aspirant = await Aspirant.findOne({ where: { _id, deleted_flag: false } })
  // return console.log(aspirant);
  if (!aspirant) return res.status(404)
    .json({ ok: false, msg: "Aspirant not found" })
  try {
    const updated = await Aspirant.update({ deleted_flag: true, first_name: '---' }, { where: { _id } })
    return res.status(200)
      .json({ ok: true, msg: 'Aspirant deleted successfully' })
  } catch (e) {
    console.log(e);
    return res.status(505)
      .json({ ok: true, msg: 'An error occoured', err: e.message })
  }
}

const _fetch = async (req, res) => {

  const aspirants = await Aspirant.findAll({ where: { deleted_flag: false } })
  res.status(200).json({ ok: true, msg: "Fetch successful", aspirants })
}

export default { _create, _fetch, _delete }