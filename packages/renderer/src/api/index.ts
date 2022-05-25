import {Get, GetCheckMusic, GetMusicLyric} from "@/http";

export interface ISongProps {
    name: string,
    id: number,
    al: {
        name: string,
        picUrl: string
    }
    ar: { name: string }[],
    dt: number
}

export interface ISongResult {

    songs: ISongProps[]

}

export const getSearchSongData = (key: string, offset: number) => Get<ISongResult>(`/cloudsearch?keywords=${key}&limit=30&offset=${offset}`)

export const checkMuisicIsAvailable = (id: number | string) => GetCheckMusic<{ success: boolean, message: string }>(`/check/music?id=${id}`)

export interface IMusicUrlProps {
    id: string | number,
    url: string,
    code: number,
    encodeType: string
}

export const getMusicUrl = (id: number | string) => Get<IMusicUrlProps[]>(`/song/url?id=${id}`)

export const downloadUrl = (id: number | string) => Get(`/song/download/url?id=${id}`)

interface ILrcProps {
    code: number,
    lrc: {
        lyric: string,
        version: number
    }
}

export const getLyric = (id: number | string) => GetMusicLyric<ILrcProps>(`/lyric?id=${id}`)
