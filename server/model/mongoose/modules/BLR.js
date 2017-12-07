import mongoose from '../config'

const BLRSchema = new mongoose.Schema({
    EvaluationOfLandResources: Object,
    EvaluationOfUrbanizationArea: Object,
    UtilizationEfficiencyOfLandResources: Object,
    EvaluationOfEcological: Object
})

const BLR = mongoose.model('BLR', BLRSchema)
export default BLR