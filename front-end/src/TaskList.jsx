import React, { useState, useEffect } from "react";
import axios from "axios";
function useDebounce(value, delay) {
    const [debouncedValue, setDebouncedValue] = useState(value)
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value)
        }, delay)
        return () => clearTimeout(handler)
    }, [value, delay])
    return debouncedValue
}

function TaskList() {
    const [search, setSearch] = useState("")
    const debouncedSearch = useDebounce(search, 500)

    const [tasks, setTasks] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                setLoading(true)
                setError(null)
                const res = await axios.get("http://localhost:4000/api/v1/tasks", {
                    params: {
                        limit: 20,
                        status: "done",
                        search: debouncedSearch
                    }
                })
                console.log("response:", res)
                setTasks(res.data.items || [])
            }
            catch (error) {
                setError("Fail to load task")
            } finally {
                setLoading(false)
            }
        }
        fetchTasks()
    }, [debouncedSearch])
    return (
        <div>
            <input type="text" placeholder="search .." value={search} onChange={(e) => setSearch(e.target.value)} />
            {loading && <p>Loading...</p>}
            {error && (
                <p>{error} <button onClick={() => window.location.reload}>Retry</button></p>
            )}
            <ul>
                {
                    tasks.length > 0 ? (tasks.map((task) => <li key={task._id}>{task.title}</li>)) : (!loading && <p>No tasks found</p>)
                }
            </ul>
        </div>
    )
}
export default TaskList