export const formateSongTime = (seconds: number) => {
    const m = Number.parseInt(((seconds / 60) % 60).toString(), 10).toString().padStart(2, '0')
    const s = Number.parseInt((seconds % 60).toString()).toString().padStart(2, '0')
    return `${m}:${s}`
}

export type LyricProsp = { time: number, text: string, keys: [number, number] }

export const hanldrLyric = (lyric: string) => {

    const timeExp = /\[(\d{2,}):(\d{2})(?:\.(\d{2,3}))?]/g
    const r: LyricProsp[] = [];
    const lines = lyric.split('\n');
    for (let i = 0; i < lines.length; i++) {
        const line = lines [i];// 如 "[00:01.997] 作词：薛之谦"
        let result = timeExp.exec(line);
        if (!result) continue;
        const txt = line.replace(timeExp, '').trim();// 现在把时间戳去掉，只剩下歌词文本
        if (txt) {
            if (result[3].length === 3) {
                // @ts-ignore
                result[3] = String(result[3] / 10);//[00:01.997] 中匹配到的 997 就会被切成 99
            }
            // @ts-ignore
            const end = result [1] * 60 * 1000 + result [2] * 1000 + (result [3] || 0) * 10
            // @ts-ignore
            const start = result [1] * 60 * 1000
            // @ts-ignore
            r.push({
                keys: [start, end],
                //@ts-ignore
                time: result [1] * 60 * 1000 + result [2] * 1000 + (result [3] || 0) * 10,
                // 转化具体到毫秒的时间，result [3] * 10 可理解为 (result / 100) * 1000
                text: txt
            });
        }
    }
    r.sort((a, b) => {
        return a.time - b.time;
    });// 根据
    const l = r.map((item, index) => {
        const next = r[index + 1]
        if (!next) return item
        const s = item.keys[1]
        const e = next.keys[1]
        const k = [s, e]
        return {...item, keys: k}
    }) as any as LyricProsp[]
    console.log(l)
    return l
}

export const findCurrentLineIndex = (time: number, list: LyricProsp[]) => {
    const index = list.findIndex(item => (time >= item.keys[0] && time < item.keys[1]))
    if (index > -1) return index
    return list.length - 1
}

