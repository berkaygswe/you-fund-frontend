
import { useState, useEffect } from 'react';

/**
 * Fetch example Json data
 * Not recommended for production use!
 */
export const useTest = (limit?: number) => {
    const [data, setData] = useState();
    useEffect(() => {
        const fetchData = async () => {

            // Note error handling is omitted here for brevity
            const response = await fetch(`http://localhost:8080/api/funds?sortBy=yearlyChange&sortDirection=asc&size=50&page=1`);
            const json = await response.json();
            const data = limit ? json.slice(0, limit) : json;
            setData(data);
        };
        fetchData();
    }, [limit]);
    return {data};
};