const dotenv = require('dotenv');
dotenv.config();

const adapter = require('./adapter');

async function main() {
  try {
    // Ensure DB is ready (noop for Mongo, sync for Postgres)
    if (adapter.ensureSync) await adapter.ensureSync();

    // Use adapter API to fetch appointments
    let appointments = await adapter.Appointment.findAll();

    // Normalize Sequelize and Mongoose results to plain objects
    if (Array.isArray(appointments) && appointments.length) {
      if (appointments[0].dataValues) {
        appointments = appointments.map(a => a.dataValues);
      } else if (appointments[0].toObject) {
        appointments = appointments.map(a => a.toObject());
      }
    }

    console.log(JSON.stringify(appointments, null, 2));
  } catch (err) {
    console.error('Error fetching appointments:', err);
    process.exitCode = 1;
  }
}

main();
