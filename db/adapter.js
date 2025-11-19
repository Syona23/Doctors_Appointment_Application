// Adapter that provides a consistent API over Mongoose or Sequelize models
const usePostgres = process.env.DB_TYPE === 'postgres';

if (usePostgres) {
  const { Appointment, Support, sequelize } = require('./models');

  // Ensure tables exist (sync) when loaded in app startup
  async function ensureSync() {
    try {
      await sequelize.authenticate();
      await sequelize.sync();
    } catch (err) {
      console.error('Sequelize sync error:', err);
    }
  }

  module.exports = {
    ensureSync,
    Appointment: {
      findAll: (opts) => Appointment.findAll(opts),
      create: (data) => Appointment.create(data),
      findByIdAndUpdate: (id, data) => Appointment.update(data, { where: { id } }),
      findByIdAndDelete: (id) => Appointment.destroy({ where: { id } }),
      findById: (id) => Appointment.findByPk(id),
    },
    Support: {
      findAll: (opts) => Support.findAll(opts),
      create: (data) => Support.create(data),
      findById: (id) => Support.findByPk(id),
      findByIdAndUpdate: (id, data) => Support.update(data, { where: { id } }),
      findByIdAndDelete: (id) => Support.destroy({ where: { id } }),
    }
  };

} else {
  const Appointment = require('../models/Appointment');
  const Support = require('../models/Support');

  module.exports = {
    ensureSync: async () => {},
    Appointment: {
      findAll: (opts) => Appointment.find(opts || {}),
      create: (data) => Appointment.create(data),
      findByIdAndUpdate: (id, data) => Appointment.findByIdAndUpdate(id, data),
      findByIdAndDelete: (id) => Appointment.findByIdAndDelete(id),
      findById: (id) => Appointment.findById(id),
    },
    Support: {
      findAll: (opts) => Support.find(opts || {}),
      create: (data) => Support.create(data),
      findById: (id) => Support.findById(id),
      findByIdAndUpdate: (id, data) => Support.findByIdAndUpdate(id, data),
      findByIdAndDelete: (id) => Support.findByIdAndDelete(id),
    }
  };
}
console.log("DB_TYPE =", process.env.DB_TYPE);

