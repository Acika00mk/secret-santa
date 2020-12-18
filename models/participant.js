module.exports = (sequelize, type) => {
  return sequelize.define('participant', {
    id: {
      type: type.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: type.STRING,
    email: type.STRING,
    address: type.STRING,
    number: type.STRING,
    phone: type.STRING,
    wish: type.STRING,
    groupId:type.INTEGER
  })
}
