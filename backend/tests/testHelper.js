const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
const env = require('../src/config/environment');

let mongoServer;

const connectDB = async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  // Ensure we are in test environment
  env.NODE_ENV = 'test';
  await mongoose.connect(uri);
};

const disconnectDB = async () => {
  if (mongoose.connection.readyState) {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  }
  if (mongoServer) {
    await mongoServer.stop();
  }
};

const clearDB = async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany({});
  }
};

module.exports = { connectDB, disconnectDB, clearDB };
