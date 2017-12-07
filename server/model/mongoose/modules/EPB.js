import mongoose from '../config'

const EPBSchema = new mongoose.Schema({
    EvaluationOfEnvironment: Object,
    EvaluationOfUrbanizationArea: Object,
    EmissionIntensityOfPollutants: Object
})

const EPB = mongoose.model('EPB', EPBSchema)
export default EPB