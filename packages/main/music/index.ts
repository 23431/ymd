import {ipcMain, dialog, Notification} from 'electron'
import * as fs from "fs";
import {IMusicUrlProps, ISongProps} from "@/api";
import axios from "axios";
import {getValue, setValue} from "../store";
import {win} from "../index";

const BASE_URL = `http://localhost:8000`

const request = axios.create({baseURL: BASE_URL})

interface IResultProps<T> {
    code: number,
    result: T,
    data: T
}

export function Get<R>(url: string) {

    return request.get(url).then(r => r.data as any as IResultProps<R>)
}


function downloadFile(filePath: string, url: string, id: string | number) {

    return new Promise((resolve, reject) => {
        axios.get(url, {
            responseType: 'stream', onDownloadProgress: (evt) => {
                console.log(evt);
                sendDownloadProgress({id, loaded: evt.loaded, total: evt.total})
            }
        }).then(res => {

            let ws = fs.createWriteStream(filePath, {encoding: "binary"})
            res.data.pipe(ws)
            res.data.on('close', () => {
                resolve(true)
                ws.close()
            })
        }).catch(() => {
            resolve(false)
        })
    })

}

function notification(subTitle: string, icon: string) {
    const notification = new Notification({
        title: 'YD',
        icon: icon,
        body: `${subTitle}  ✅　`
    })
    notification.show()
}

export type downloadProgress = {
    id: string | number,
    loaded: number,
    total: number
}

function sendDownloadProgress(args: downloadProgress) {
    win?.webContents.send('download:progress', args)
}

export const getMusicUrl = (id: number | string) => Get<IMusicUrlProps[]>(`/song/url?id=${id}`)


function createDialog() {
    return dialog.showOpenDialog({title: '选择文件存储位置', properties: ['openDirectory']})
}

async function getMuiscReallyAddr(songId: string | number) {
    try {
        const result = await getMusicUrl(songId)
        if (result.code === 200 && Array.isArray(result.data) && result.data.length > 0) {
            const url = result.data[0].url
            return Promise.resolve({flag: 0, url})
        } else {

        }
    } catch (e) {
        return Promise.resolve({flag: -1, url: ''})
    }
    return Promise.resolve({flag: -1, url: ''})
}


async function combin(song: ISongProps, path: string) {
    const {flag, url} = await getMuiscReallyAddr(song.id)
    if (flag === 0) {
        const filePath = `${path}/${song.name}.mp3`
        const result = await downloadFile(filePath, url, song.id)
        result && notification(song.name, song.al.picUrl || '🎧');
    }
}


ipcMain.on('download', async (e, song: ISongProps) => {

    const tryGetFilPath = getValue()
    if (tryGetFilPath) {
        await combin(song, tryGetFilPath)
    } else {
        const dialog = await createDialog()
        if (!dialog.canceled) {
            const path = dialog.filePaths[0]
            setValue(path)
            await combin(song, path)
        }
    }

})

