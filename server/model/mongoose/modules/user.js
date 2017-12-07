import mongoose from '../config'

const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    manager: Boolean
})

const user = mongoose.model('user', userSchema)
export default user