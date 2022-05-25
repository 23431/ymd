import {Request} from '../util/request'
export default function check_music(query:any,request:Request){

    const data = {
        ids: '[' + parseInt(query.id) + ']',
        br: parseInt(query.br || 999000),
    }
    return request(
        'POST',
        `https://music.163.com/weapi/song/enhance/player/url`,
        data,
        {
            crypto: 'weapi',
            cookie: query.cookie,
            proxy: query.proxy,
            realIP: query.realIP,
        },
    ).then((response) => {
        let playable = false
        // @ts-ignore
        if (response.body.code == 200) {
            // @ts-ignore
            if (response.body.data[0].code == 200) {
                playable = true
            }
        }
        if (playable) {
            // @ts-ignore
            response.body = { success: true, message: 'ok' }
            return response
        } else {
            // @ts-ignore
            response.status = 404
            // @ts-ignore
            response.body = { success: false, message: '亲爱的,暂无版权' }
            return Promise.reject(response)
        }
    })
}
