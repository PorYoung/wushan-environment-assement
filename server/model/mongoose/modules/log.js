import mongoose from '../config'

const logSchema = new mongoose.Schema({
    date: Date,
    username: String,
    statistics: Object
})

const log = mongoose.model('log', logSchema)
export default log