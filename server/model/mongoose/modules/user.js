import mongoose from '../config'

const userSchema = new mongoose.Schema({
    username: String,
    password: String
})

const user = mongoose.model('user', userSchema)
export default user