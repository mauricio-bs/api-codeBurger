import Sequelize from 'sequelize'
import mongoose from 'mongoose'
import configDB from '../config/database'

import User from '../app/models/User'
import Products from '../app/models/Product'
import Category from '../app/models/Category'

const models = [User, Products, Category]

class Database {
  constructor() {
    this.init()
    this.mongo()
  }

  init() {
    // Connection string
    this.connection = new Sequelize(configDB)
    // Connect model per model
    models
      .map((model) => model.init(this.connection))
      .map(
        (model) => model.associate && model.associate(this.connection.models)
      )
  }

  mongo() {
    this.mongoConnection = mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
  }
}

export default new Database()
