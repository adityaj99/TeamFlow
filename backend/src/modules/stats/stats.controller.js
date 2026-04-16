import { getStatsService } from "./stats.service.js"

export const getStats = (req, res, next) => {
    try {
        const { scope, projectId } = req.query

        const data = await getStatsService({ scope, projectId, orgId: req.orgId });

        res.status(200).json({
            success: true,
            data,
        })

    } catch (error) {
        next(error)
    }
}