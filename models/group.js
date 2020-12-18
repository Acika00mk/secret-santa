module.exports = (sequelize, type) => {
  return sequelize.define('group', {
    id: {
      type: type.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: type.STRING
  })
}
