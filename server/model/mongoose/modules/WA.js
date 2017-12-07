import mongoose from '../config'

const WASchema = new mongoose.Schema({
    EvaluationOfWarterResources: Object,
    UtilizationEfficiencyOfWarterResources: Object
})

const WA = mongoose.model('WA', WASchema)
export default WA