import * as http from "http";
import {serializeQuery} from "./util";
import Cloudsearch from "./module/cloudsearch";
import request from "./util/request";
import check_music from "./module/check_music";
import song_download_url from "./module/song_download_url";
import song_url from "./module/song_url";
import lyric from "./module/lyric";

const app = http.createServer(async (req, res) => {

    res.setHeader('Content-type', 'application/json')
    // //设置允许跨域的域名，*代表允许任意域名跨域
    res.setHeader("Access-Control-Allow-Origin", "*");
    // //允许的header类型
    res.setHeader("Access-Contro1-Allow-Headers", "content-type,X-Requested-With");
    // //跨域允许的请求方式
    res.setHeader("Access-Control-Allow-Methods", "DELETE,PUT,POST,GET,OPTIONS");
    const method = req.method

    const [path, queryString] = req.url!.split('?')
    const query = serializeQuery(queryString)

    const routes = path.substring(1)
    if (routes === 'cloudsearch') {
        const {body} = await Cloudsearch(query, request) as any
        res.end(JSON.stringify(body))
        return
    }

    if (routes === 'check/music') {
        const result = await check_music(query, request) as any
        res.end(JSON.stringify(result.body))
        return
    }
    if (routes === 'song/url') {
        const result = await song_url(query, request) as any
        res.end(JSON.stringify(result.body))
        return
    }

    if (routes === 'song/download/url') {
        const result = await song_download_url(query, request) as any
        res.end(JSON.stringify(result.body))
        return
    }

    if (routes === 'lyric') {
        const result = await lyric(query, request) as any
        res.end(JSON.stringify(result.body))
        return
    }
    res.writeHead(404, {'Content-type': 'text/plain'})
    res.end('404 Not Found \n')
})

export default app
