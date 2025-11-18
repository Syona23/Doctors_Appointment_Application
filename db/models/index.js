const sequelize = require('../sequelize');

const AppointmentFactory = require('./appointment');
const SupportFactory = require('./support');

const Appointment = AppointmentFactory(sequelize);
const Support = SupportFactory(sequelize);

module.exports = {
  sequelize,
  Appointment,
  Support,
};
