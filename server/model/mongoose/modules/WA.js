import mongoose from '../config'

const WASchema = new mongoose.Schema({
    submitDate: Date,
    statisticsDate: String,
    EvaluationOfWarterResources: Object,
    UtilizationEfficiencyOfWarterResources: Object
})

const WA = mongoose.model('WA', WASchema)
export default WA