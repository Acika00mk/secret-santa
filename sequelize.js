require('dotenv').config()
const Sequelize = require('sequelize')
const ParticipantModel = require('./models/participant')
const GroupModel = require('./models/group')

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
  host: process.env.DB_HOST,
  dialect: 'mysql',
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
})

const Participant = ParticipantModel(sequelize, Sequelize)
const Group = GroupModel(sequelize, Sequelize)

Participant.belongsTo(Group);
Group.hasMany(Participant);

if(process.env.sync){
  sequelize.sync({ force: false })
  .then(() => {
    console.log(`Database & tables created!`)
    process.exit()
  })

}

module.exports = {
  Participant,
  Group
}
