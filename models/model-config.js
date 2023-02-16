import * as dotenv from 'dotenv'
dotenv.config()
import { Sequelize, Model, DataTypes } from 'sequelize';
import bcrypt from 'bcrypt'

const sequelize = new Sequelize(process.env.DB_DATABASE, process.env.DB_USER, process.env.PASSWORD, {
  host: process.env.DB_HOST
  , dialect: 'mysql'
})

const aspirantSchema = {
  first_name: "first-name"
  , other_names: "middleName surname"

  , department: "information technology"
  , avatar: "uploads/" + generateMongoObjectId()
    .slice(generateMongoObjectId()
      .length - 9, generateMongoObjectId()
      .length - 1) + '.pnj'
  , office_id: 1
}

const officeSchema = {
  name: "President"
}


const Office = sequelize.define('Office', {
  id: {
    type: DataTypes.INTEGER
    , autoIncrement: true
    , allowNull: false
    , primaryKey: true
    , unique: true
  }
  , _id: {
    type: DataTypes.STRING
    , defaultValue: generateMongoObjectId()
  }
  , name: {
    type: DataTypes.STRING
    , unique: {
      args: true
      , msg: 'Office already exists'
    }
  }
  , deleted_flag: {
    type: DataTypes.BOOLEAN
    , allowNull: false
    , defaultValue: false
  }
})


const Aspirant = sequelize.define('Aspirant', {
  // Model attributes are defined here
  id: {
    type: DataTypes.INTEGER
    , autoIncrement: true
    , allowNull: false
    , primaryKey: true
    , unique: true
  }
  , _id: {
    type: DataTypes.STRING
    , defaultValue: generateMongoObjectId()
  }
  , first_name: {
    type: DataTypes.STRING
    , unique: {
      args: true
      , msg: 'Please use another first name'
    }
  }
  // , "office_id" INTEGER REFERENCES "office"("id") ON DELETE SET NULL ON UPDATE CASCADE
  , other_names: {
    type: DataTypes.STRING
  }
  , department: {
    type: DataTypes.STRING
    , allowNull: true

  }
  , avatar: {
    type: DataTypes.STRING
    // , allowNull: true

  }
  , deleted_flag: {
    type: DataTypes.BOOLEAN
    , allowNull: false
    , defaultValue: false
  }
})

const voteSchema = {
  office_ids: [1, 3, 2]
    // office_id: JSON.stringify([1, 3, 2])
  , aspirant_ids: ["dfhjsd", "ewodjs", "adsskd"]
  , voter_id: 1
}

const voterSchema = {
  reg_no: 12273223284
  , password: "sdghsdbjs"
  , _id: generateMongoObjectId()
}

const Voter = sequelize.define('Voter', {
  id: {
    type: DataTypes.INTEGER
    , autoIncrement: true
    , allowNull: false
    , primaryKey: true
    , unique: true
  }
  , _id: {
    type: DataTypes.STRING
    , defaultValue: generateMongoObjectId()
  }
  , reg_no: {
    type: DataTypes.BIGINT
    , get() {
      const rv = this.getDataValue('reg_no')
      return rv ? rv : null;
    }
    , unique: {
      args: true
      , msg: `Voter alrady exists`
    }
  }
  // , password: {
  //   type: DataTypes.STRING
  //   , set(value) {
  //     let salt = bcrypt.genSaltSync(10);
  //     let hashed = bcrypt.hashSync(value, salt)
  //     this.setDataValue('password', hashed);
  //   }
  // }
  , voted: {
    type: DataTypes.BOOLEAN
    , allowNull: false
    , defaultValue: false
  }
  , logged_in: {
    type: DataTypes.BOOLEAN
    , allowNull: false
    , defaultValue: false
  }

})

const Admin = sequelize.define('Admin', {
  id: {
    type: DataTypes.INTEGER
    , autoIncrement: true
    , allowNull: false
    , primaryKey: true
    , unique: true
  }
  , pass_name: {
    type: DataTypes.STRING
    , unique: true
  }
  , pass_token: {
    type: DataTypes.STRING
    // , set(value) {
    //   let salt = bcrypt.genSaltSync(10);
    //   let hashed = bcrypt.hashSync(value, salt)
    //   this.setDataValue('password', hashed);
    // }
  }
  , isActive: {
    type: DataTypes.BOOLEAN
    , allowNull: false
    , defaultValue: false
  }
  , votingCommenced: {
    type: DataTypes.BOOLEAN
    , allowNull: false
    , defaultValue: false
  }

})
const Poll = sequelize.define('Poll', {
  id: {
    type: DataTypes.INTEGER
    , autoIncrement: true
    , allowNull: false
    , primaryKey: true
    , unique: true
  }
  , office_ids: { type: DataTypes.JSON }
  , aspirant_ids: { type: DataTypes.JSON }

})
const Token = sequelize.define('Token', {
  _token: {
    type: DataTypes.STRING
    // , async set(value) {
    //   let salt = await bcrypt.genSaltSync(5);
    //   let hashed = await bcrypt.hashSync(value, salt)
    //   this.setDataValue('token', hashed);
    // }
  }
  , isUsed: {
    type: DataTypes.BOOLEAN
    , allowNull: false
    , defaultValue: false
  }
})

Office.hasOne(Aspirant, {
  foreignKey: {
    name: 'office_id'

  }
})

Voter.hasOne(Poll, {
  foreignKey: {
    name: 'voter_id'
      // , type: DataTypes.STRING
    , unique: {
      args: true
      , msg: 'Voter cannot vote twice'
    }
  }
})

// console.log(process.env.DB_HOST)

// --------------------------test------------
// await sequelize.sync({ force: false, /*alter: true*/ });
// Office.create(officeSchema)
// Aspirant.create(aspirantSchema)
// Voter.create(voterSchema)
// Poll.create(voteSchema)
// await Voter.bulkCreate([ { _id: '0c53d0a7c2e3ef8f7', reg_no: 20207444841 }, { _id: '0a9012a81aeb628df', reg_no: 20200087727 } ])
// await Token.bulkCreate([{ _token: 'nk8ucery' }, { _token: 'rdoaz88pm' }, ],{ fields: ['_token'] })
// Admin.create({ pass_name: "kingchi", pass_token: "Dev kingchi" })
// console.log(await Admin.findAll())

// console.log(Aspirant === sequelize.models.Aspirant);
function generateMongoObjectId() {
  const thousand = 1000;
  const sixteen = 16;
  const timestamp = ((new Date()
      .getMilliseconds() / thousand) | 0)
    .toString(sixteen);
  return (
    timestamp +
    "xxxxxxxxxxxxxxxx"
    .replace(/[x]/g, function () {
      return ((Math.random() * sixteen) | 0)
        .toString(sixteen);
    })
    .toLowerCase()
  );
};

export { Poll, Voter, Office, Aspirant, Token, generateMongoObjectId, sequelize, Admin }
export default sequelize