import axios from "axios";

const BASE_URL = `http://localhost:8000`

const request = axios.create({baseURL: BASE_URL})

interface IResultProps<T> {
    code: number,
    result: T,
    data: T,
    lrc: T
}

export function Get<R>(url: string) {

    return request.get(url).then(r => r.data as any as IResultProps<R>)
}

export function GetCheckMusic<R>(url: string) {
    return request.get(url).then(r => r.data as any as R)
}


export function GetMusicLyric<R>(url: string) {

    return request.get(url).then(r => r.data as any as R)
}
