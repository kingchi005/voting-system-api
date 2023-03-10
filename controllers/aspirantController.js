import multer from 'multer'
import { aspirantSchema, aspirantSchema_update } from './validator.js'
import { Aspirant, generateMongoObjectId, Office } from '../models/model-config.js'
import { uploadImage } from './middlewares.js'

// const uploaded_image = await uploadImage("data:image/png;base64,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")
// console.log(uploaded_image)
const _create = async (req, res) => {
  const { error, value } = aspirantSchema.validate(req.body, { abortEarly: false })
  if (error) return res.status(400)
    .json({ ok: false, msg: error.message })

  let asp_available = await Office.findOne({ where: { id: value.office_id, deleted_flag: false } })
  if (!asp_available) return res.status(404).json({ ok: false, msg: 'Selected office is not availavle' })

  // upload to cloudinary
  try {
    const uploaded_image = await uploadImage(value.avatar)
    if (uploaded_image.error) {
      return res.status(505).json({ ok: false, msg: "An Error occoured", error: uploaded_image.error })
    }
    // console.log(uploaded_image)
    value.avatar = uploaded_image.secure_url
    value._id = generateMongoObjectId()
    // value.avatar = avatar_name_
    const aspirant = await Aspirant.create(value)
    return res.status(200)
      .json({ ok: true, msg: 'Aspirant created successfully', aspirant })
  } catch (e) {
    // console.log(e.name)
    if (e.name == "SequelizeUniqueConstraintError") {
      if (e.errors[0]?.validatorKey === 'not_unique') return res.json({ ok: false, msg: e.errors[0].message })
    }
    return res.status(505).json({ ok: false, msg: 'An error occoured', err: e.message })
  }
}

const _update = async (req, res) => {

  const _id = req.params.id
  const exist = await Aspirant.findOne({ where: { _id, deleted_flag: false } })
  if (!exist) return res.status(404).json({ ok: false, msg: "Aspirant does not exist" })

  const { error, value } = aspirantSchema_update.validate(req.body, { abortEarly: false })
  if (error) return res.status(400)
    .json({ ok: false, msg: error.message })

  let asp_available = await Office.findOne({ where: { id: value.office_id, deleted_flag: false } })
  if (!asp_available) return res.status(404).json({ ok: false, msg: 'Selected office is not availavle' })

  	const {first_name, other_names, department, office_id} = value
  // upload to cloudinary
  try {
  	let updated
  	if (value.avatar != '') {
	    const uploaded_image = await uploadImage(value.avatar)
	    if (uploaded_image.error) {
	      return res.status(505).json({ ok: false, msg: "An Error occoured", error: uploaded_image.error })
	    }  		
	    updated = await Aspirant.update({ first_name, other_names, department, office_id, avatar:uploaded_image.secure_url }, { where: { _id } })  		
  	}else{
    // console.log(uploaded_image)
    // update here--------------------------------------------------
	    updated = await Aspirant.update({ first_name, other_names, department, office_id }, { where: { _id } })
  	}
    if (!updated) return res.status(200).json({ ok: false, msg: 'Could not update aspirant' })
    return res.status(200).json({ ok: true, msg: 'Aspirant updated successfully' })
  } catch (e) {
    // console.log(e.name)
    if (e.name == "SequelizeUniqueConstraintError") {
      if (e.errors[0]?.validatorKey === 'not_unique') return res.json({ ok: false, msg: e.errors[0].message })
    }
    return res.status(505).json({ ok: false, msg: 'An error occoured', err: e.message })
  }
};

const _delete = async (req, res) => {
  const _id = req.params.id
  const aspirant = await Aspirant.findOne({ where: { _id, deleted_flag: false } })
  // return console.log(aspirant);
  if (!aspirant) return res.status(404)
    .json({ ok: false, msg: "Aspirant not found" })
  try {
    const updated = await Aspirant.update({ deleted_flag: true, first_name: aspirant._id+'---deleted' }, { where: { _id } })
    // console.log(updated)
    return res.status(200).json({ ok: true, msg: 'Aspirant deleted successfully' /*, deleted_aspirant: updated*/ })
  } catch (e) {
    console.log(e);
    return res.status(505)
      .json({ ok: true, msg: 'An error occoured', err: e.message })
  }
}

const _fetch = async (req, res) => {

  const aspirants = await Aspirant.findAll({ where: { deleted_flag: false } })
  const offices = await Office.findAll({ where: { deleted_flag: false } })
/*  for (let asp of aspirants) {
  	asp.office = offices.filter(o => o.id == asp.office_id)
  }
*/
  res.status(200).json({ ok: true, msg: "Fetch successful", aspirants })
}

const _fetch_index = async (req, res) => {
	const election_index = []

	const offices = await Office.findAll({ where: { deleted_flag: false } })
	if (!offices.length || !offices) return res.status(404).json({ ok: false, msg: "No office found" })
	const offices_result = []

	for (var i = 0; i < offices.length; i++) {
	  // const query = `SELECT * FROM polls WHERE JSON_CONTAINS(aspirant_ids, '"${offices[i]._id}"')`
	  // const [votes, metadata] = await sequelize.query( query);

	  offices_result.push({
	    // id: offices[i].id,
	    _id: offices[i]._id,
	    name: offices[i].name,
	    deleted_flag: offices[i].deleted_flag,
	    createdAt: offices[i].createdAt,
	    updatedAt: offices[i].updatedAt,
	  })
	  // offices[i].no_of_votes = votes.length
	};
	// console.log(offices_result)


	const aspirants = await Aspirant.findAll({ where: { deleted_flag: false } })
	// if (!aspirants.length || !aspirants) return res.status(404).json({ ok: false, msg: "No aspirant found" })

	const aspirants_result = []

	// const votes = await Poll.findAll()
	// console.log(votes)

	for (var i = 0; i < aspirants.length; i++) {
	  // const query = `SELECT * FROM polls WHERE JSON_CONTAINS(aspirant_ids, '"${aspirants[i]._id}"')`
	  // const [votes, metadata] = await sequelize.query( query);
	  

	  aspirants_result.push({
	    // id: aspirants[i].id,
	    _id: aspirants[i]._id,
	    first_name: aspirants[i].first_name,
	    other_names: aspirants[i].other_names,
	    department: aspirants[i].department,
	    avatar: aspirants[i].avatar,
	    deleted_flag: aspirants[i].deleted_flag,
	    createdAt: aspirants[i].createdAt,
	    updatedAt: aspirants[i].updatedAt,
	    office_id: aspirants[i].office_id,
	    // number_of_votes:votes.filter(v => v.aspirant_ids.includes(aspirants[i]._id)).length
	  })
	  // aspirants[i].no_of_votes = votes.length
	};
	// console.log(aspirants_result)

	for(let o of offices) {

	  let offObj = {
	    office_name:o.name,
	    aspirants:[]
	  }
	  for(let asp of aspirants_result) {
	    if (asp.office_id == o.id) {
	      asp.office = o.name
	      offObj.aspirants.push(asp)
	    }
	  };

	  election_index.push(offObj)
	};

	res.status(200).json({ ok: true, msg: "Fetch successful", election_index })
};
export default { _create, _fetch, _delete, _update, _fetch_index }