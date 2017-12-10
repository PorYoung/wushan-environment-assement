import mongoose from '../config'

const FBSchema = new mongoose.Schema({
    submitDate: Date,
    statisticsDate: String,
    EvaluationOfEcological: Object,
    EvaluationOfKeyEcologicalFunctionArea: Object,
    EcologicalQuality: Object
})

const FB = mongoose.model('FB', FBSchema)
export default FB