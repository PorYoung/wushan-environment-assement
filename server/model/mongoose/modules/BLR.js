import mongoose from '../config'

const BLRSchema = new mongoose.Schema({
    submitDate: Date,
    statisticsDate: String,
    EvaluationOfLandResources: Object,
    EvaluationOfUrbanizationArea: Object,
    UtilizationEfficiencyOfLandResources: Object,
    EvaluationOfEcological: Object
})

const BLR = mongoose.model('BLR', BLRSchema)
export default BLR