import {ipcMain, dialog, Notification} from 'electron'
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

function notification(subTitle: string, icon: string) {
    const notification = new Notification({
        title: '下载完成',
        icon: icon,
        body: `${subTitle}  ✅　`
    })
    notification.show()
}

export type downloadProgressProps = {
    filePath: string, songId: string | number, progress: number
}

function sendDownloadIndfo(args: downloadProgressProps, type: string = 'download:end') {
    win?.webContents.send(type, args)
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
        createFile(filePath, song, url)
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


function createFile(filePath: string, song: ISongProps, url: string) {

    win?.webContents.downloadURL(url)
    win?.webContents.session.on('will-download', (event, item, webContents) => {
        item.setSavePath(filePath)
        item.on('updated', (event, state) => {
            const progress = Number.parseFloat((item.getReceivedBytes() / item.getTotalBytes()).toFixed(2))
            // sendDownloadIndfo({progress, songId: song.id, filePath})
        })
        item.once('done', () => {
            sendDownloadIndfo({progress: 1, songId: song.id, filePath})
            notification(song.name, song.al.picUrl || '🎧');
        })
    })


}



