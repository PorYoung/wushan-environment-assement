import mongoose from '../config'

const DRCSchema = new mongoose.Schema({
    submitDate: Date,
    statisticsDate: String,
    EvaluationOfLandResources: Object,
    EvaluationOfUrbanizationArea: Object,
    UtilizationEfficiencyOfLandResources: Object,
    EvaluationOfWarterResources: Object,
    UtilizationEfficiencyOfWarterResources: Object,
    EvaluationOfEnvironment: Object,
    EmissionIntensityOfPollutants: Object,
    EvaluationOfEcological: Object,
    EvaluationOfKeyEcologicalFunctionArea: Object,
    EcologicalQuality: Object
})