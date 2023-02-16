import { Poll, Voter, sequelize, Aspirant, Office } from '../models/model-config.js'
import { pollSchema } from './validator.js'


const _create = async (req, res) => {
  const id = req.params.id
  const { error, value } = pollSchema.validate(req.body, { abortEarly: false })
  if (error) return res.status(400)
    .json({ ok: false, msg: error.message })
  
  value.office_ids = [... new Set(value.office_ids)]
  value.aspirant_ids = [... new Set(value.aspirant_ids)]

  // return res.json({value})
  const voter = await Voter.findOne({ where: { id } })
  if (!voter) return res.status(401)
    .json({ ok: false, msg: 'Voter does not exist' })
  if (voter /*[0]*/ .dataValues.voted) return res.status(401)
    .json({ ok: false, msg: 'You cannot vote twice' })

  value.voter_id = id
  try {
    const done = await Poll.create(value)
    Voter.update({ voted: true }, { where: { id } })
    return res.status(200) .json({ ok: true, msg: 'Voted successfully' })
  } catch (e) {
    console.log(e /*.errors[0].validatorKe*/ );
    if (e.errors[0]?.validatorKey === 'not_unique') {
      return res.json({ ok: false, msg: e.errors[0].message })
    }
    return res.status(505)
      .json({ ok: false, msg: 'An error occoured', err: e.message })
  }

  // console.log(value)
  res.json({ ok: true, msg: "created now voted by " + id })
}

const _fetch = async (req, res) => {
  const data = await Poll.findAll()
  const polls = []
  for (let p of data) {
    polls.push({
      id: p.id
      , office_ids: JSON.parse(p.office_ids)
      , aspirant_ids: JSON.parse(p.aspirant_ids)
      , voter_id: p.voter_id
      , createdAt: p.createdAt
      , updatedAt: p.updatedAt
    })
  };
  // console.log(polls)  

  res.status(200)
    .json({ ok: true, polls })
}


// prototype
const election_result_proto = {
  votes:[
    {
      office:"President",
      aspirants:[
        {
          "id": 3,
          "_id": "02704baf09338f8e5",
          "first_name": "King",
          "other_names": "Eze",
          "department": "IFT",
          "avatar": "no avatar",
          "deleted_flag": false,
          "createdAt": "2023-02-06T20:11:47.000Z",
          "updatedAt": "2023-02-06T20:11:47.000Z",
          "office_id": 2
        },
        {
          "id": 3,
          "_id": "02704baf09338f8e5",
          "first_name": "King",
          "other_names": "Eze",
          "department": "IFT",
          "avatar": "no avatar",
          "deleted_flag": false,
          "createdAt": "2023-02-06T20:11:47.000Z",
          "updatedAt": "2023-02-06T20:11:47.000Z",
          "office_id": 2
        }
      ]
    },
    {
      office:"Secretaary",
      aspirants:[
        {
          "id": 3,
          "_id": "02704baf09338f8e5",
          "first_name": "King",
          "other_names": "Eze",
          "department": "IFT",
          "avatar": "no avatar",
          "deleted_flag": false,
          "createdAt": "2023-02-06T20:11:47.000Z",
          "updatedAt": "2023-02-06T20:11:47.000Z",
          "office_id": 2
        },
        {
          "id": 3,
          "_id": "02704baf09338f8e5",
          "first_name": "King",
          "other_names": "Eze",
          "department": "IFT",
          "avatar": "no avatar",
          "deleted_flag": false,
          "createdAt": "2023-02-06T20:11:47.000Z",
          "updatedAt": "2023-02-06T20:11:47.000Z",
          "office_id": 2
        }
      ]
    }, 
  ]
}
// const election_result = {}
// election_result.votes = {one:"sjkhdjshd"}
// console.log(election_result)


const _fetch_result = async (req, res) => {
  const election_result = {
    votes:[]
  }

  const offices = await Office.findAll({ where: { deleted_flag: false } })
  if (!offices.length || !offices) return res.status(404).json({ ok: false, msg: "No office found" })
  const offices_result = []

  for (var i = 0; i < offices.length; i++) {
    // const query = `SELECT * FROM polls WHERE JSON_CONTAINS(aspirant_ids, '"${offices[i]._id}"')`
    // const [votes, metadata] = await sequelize.query( query);

    offices_result.push({
      id: offices[i].id,
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

  const votes = await Poll.findAll()
  // console.log(votes)

  for (var i = 0; i < aspirants.length; i++) {
    // const query = `SELECT * FROM polls WHERE JSON_CONTAINS(aspirant_ids, '"${aspirants[i]._id}"')`
    // const [votes, metadata] = await sequelize.query( query);
    

    aspirants_result.push({
      id: aspirants[i].id,
      _id: aspirants[i]._id,
      first_name: aspirants[i].first_name,
      other_names: aspirants[i].other_names,
      department: aspirants[i].department,
      avatar: aspirants[i].avatar,
      deleted_flag: aspirants[i].deleted_flag,
      createdAt: aspirants[i].createdAt,
      updatedAt: aspirants[i].updatedAt,
      office: aspirants[i].office_id,
      number_of_votes:votes.filter(v => v.aspirant_ids.includes(aspirants[i]._id)).length
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
      if (asp.office == o.id) {
        asp.office = o.name
        offObj.aspirants.push(asp)
      }
    };

    election_result.votes.push(offObj)
  };

  res.status(200).json({ ok: true, msg: "Fetch successful", election_result })
}

export default { _create, _fetch_result,_fetch }