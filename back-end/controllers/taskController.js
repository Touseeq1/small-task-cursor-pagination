
import Task from "../models/task.js"
export const getTasks = async (req, res, next) => {
    try {
        let { limit = 10, cursor, status } = req.query;
        limit = parseInt(limit, 10)
        if (isNaN(limit) || limit < 1 || limit > 50) {
            return res.status(400).json({ error: "Limit must be btw 1 and 50" })
        }

        if (status && !["todo", "doing", "done"].includes(status)) {
            return res.status(400).json({ error: "Invalid status" })
        }
        const query = {}
        if (status) query.status = status

        if (cursor && mongoose.Type.ObjecId.isVali(cursor)) {
            query._id = { $lt: cursor }
        }

        const items = await Task.find(query)
            .sort({ createdAt: -1, _id: -1 })
            .limit(limit + 1)
            .select("title status priority createdAt")

        const hasNextPage = items.length > limit;
        const results = hasNextPage ? items.slice(0, -1) : items
        const nextCursor = hasNextPage ? results[results.length - 1]._id : null

        res.json({
            items: results, nextCursor
        })
    } catch (err) {
        next(err)
    }
}