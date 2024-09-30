import express from 'express'
import StatsHandler from '../Handler/StatsHandler.mjs'

const statsRouter = express.Router()

statsRouter.get("/",StatsHandler.statData)

statsRouter.get("/branch-wise-placement",StatsHandler.branchWisePlacement)

statsRouter.get("/complateCampus",StatsHandler.complateCampus)

statsRouter.get("/branch_wise_placement/:campusId",StatsHandler.campusStats)
export default statsRouter;