import {Request} from "../util/request";

export default function song_download_url(query:any,request:Request) {
    const data = {
        id: query.id,
        br: parseInt(query.br || 999000),
    }
    return request(
        'POST',
        `https://interface.music.163.com/eapi/song/enhance/download/url`,
        data,
        {
            crypto: 'eapi',
            cookie: query.cookie,
            proxy: query.proxy,
            realIP: query.realIP,
            url: '/api/song/enhance/download/url',
        },
    )
}
