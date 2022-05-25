import crypto from 'crypto'
import {Request} from "../util/request";

export default function song_url(query: any, request: Request) {
    query.cookie = {
        _ntes_nuid: crypto.randomBytes(16).toString('hex'),
        os: 'pc'
    }
    // query.cookie._ntes_nuid =
    // query.cookie.os = 'pc'
    const data = {
        ids: '[' + query.id + ']',
        br: parseInt(query.br || 999000),
    }
    return request(
        'POST',
        `https://interface3.music.163.com/eapi/song/enhance/player/url`,
        data,
        {
            crypto: 'eapi',
            cookie: query.cookie,
            proxy: query.proxy,
            realIP: query.realIP,
            url: '/api/song/enhance/player/url',
        },
    )
}
