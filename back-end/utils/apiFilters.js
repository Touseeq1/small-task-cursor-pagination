class APIFilters {
    constructor(query, queryStr) {
        this.query = query
        this.queryStr = queryStr
    }
    search() {
        const keyword = this.queryStr.keyword ? {
            name: {
                $regex: this.queryStr.keyword,
                $options: "i"
            }
        } : {}
        this.query = this.query.find({ ...keyword })
        return this
    }
    filters() {
        const queryCopy = { ...this.queryStr }
        // Remove unwanted fields
        const fieldsToRemove = ["keyword", "page", "limit"];
        fieldsToRemove.forEach((el) => delete queryCopy[el]);

        // Advance filter for price, rating
        let newQuery = {}
        Object.keys(queryCopy).forEach((key) => {
            if (key.includes("[")) {
                // Example: key = "price[gte]"
                const [field, operator] = key.split("[");
                const op = operator.replace("]", "")
                if (!newQuery[field]) {
                    newQuery[field] = {} // price:{}
                }
                newQuery[field][`$${op}`] = queryCopy[key]
            } else {
                newQuery[key] = queryCopy[key]
            }
        })
        // console.log("newQuery:", newQuery)
        this.query = this.query.find(newQuery)
        return this
    }
    pagination(resPerPage) {
        const currentPage = Number(this.queryStr.page) || 1
        const skip = resPerPage * (currentPage - 1);
        this.query = this.query.limit(resPerPage).skip(skip)
        return this
    }
}
export default APIFilters