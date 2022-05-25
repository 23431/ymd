export const cookieToJson = (cookie: string) => {
    if (!cookie) {
        return {}
    }
    let cookieArr = cookie.split(';')
    let obj = {}
    cookieArr.forEach((i) => {
        let arr = i.split('=')
        // @ts-ignore
        obj[arr[0]] = arr[1]
    })
    return obj
}

export interface QueryType {
    [key: string]: any
}

export const serializeQuery = (queryString: string) => {
    const query: QueryType = {}
    if (!queryString) return query

    return queryString.split('&').reduce((prev, next) => {
        if (next) {
            const [key, value] = next.split('=').map(r => r.trim())
            try {
                prev[key] = decodeURIComponent(value)
            } catch (e) {
                prev[key] = value
            }
        }
        return prev
    }, query)
}
