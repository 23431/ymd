import {Request} from "../util/request";

export default function lyric(query: any, request: Request) {
    query.cookie = {
        os: 'pc'
    }
    const data = {
        id: query.id,
        tv: -1,
        lv: -1,
        rv: -1,
        kv: -1,
    }
    return request(
        'POST',
        `https://music.163.com/api/song/lyric?_nmclfl=1`,
        data,
        {
            crypto: 'api',
            cookie: query.cookie,
            proxy: query.proxy,
            realIP: query.realIP,
        },
    )
}
