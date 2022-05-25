import Search from "@/components/search";
import styles from '@/styles/app.module.scss'
import List from "@/components/list";
import {useCallback, useEffect, useRef, useState} from "react";
import {checkMuisicIsAvailable, getLyric, getMusicUrl, getSearchSongData, ISongProps} from "@/api";
import Player from "@/components/player";
import {hanldrLyric, LyricProsp} from "@/utils";
import DownloadList from "@/components/download-list";
import {downloadProgress} from "../../main/music";

const App = () => {


    const [list, setList] = useState<ISongProps[]>([])
    const [currentSong, setCurrentSong] = useState<ISongProps | null>(null)
    const [offset, setOffset] = useState<number>(1)
    const [url, setUrl] = useState<string>('')
    const keyRef = useRef<string>('')
    const lryicRef = useRef<LyricProsp[]>([])
    const [isShow, setIsShow] = useState(false)
    const search = useCallback((key: string) => {
        keyRef.current = key
        setOffset(1)
        if (key === '') {
            setList([])
            return
        }
        getSongList(key, offset)
    }, [offset])
    const clear = useCallback(() => {
        setList([])
        keyRef.current = ''
        setOffset(1)
    }, [])
    useEffect(() => {
        window.ipcRenderer.on('success', () => {
            console.log('文件下载成功')
        })
        window.ipcRenderer.on('download:progress', (event, args: downloadProgress) => {
            console.log(args);
        })

    }, [])
    const getSongList = (key: string, offset: number) => {
        getSearchSongData(key, offset).then(r => {
            if (r.code === 200) {
                const list = r.result.songs
                setList(l => Array.isArray(list) ? [...l, ...list] : l)
            }
        })
    }

    const play = async (song: ISongProps) => {
        const id = song.id
        setCurrentSong(song)
        const result = await checkMuisicIsAvailable(id)
        if (result.success) {
            const result = await getMusicUrl(id)
            const lrcResult = await getLyric(id)
            if (lrcResult.code === 200) {
                // console.log(lrcResult.lrc.lyric);
                lryicRef.current = hanldrLyric(lrcResult.lrc.lyric)
            }
            if (result.code === 200) {
                const urls = result.data
                if (Array.isArray(urls) && urls.length > 0 && urls[0].url) {
                    setUrl(urls[0].url)
                }
            }
        } else {

        }
    }
    const onEnd = () => {
        setCurrentSong(null)
    }
    const openDownLoadList = useCallback(() => {
        setIsShow(s => !s)
    }, [isShow])
    const download = (song: ISongProps) => {
        window.ipcRenderer.send('download', song)
    }
    const fetchData = () => {
        setOffset(c => c + 1)
        search(keyRef.current)
    }
    return (
        <div className={styles.app}>

            <div className={styles.search}>
                <Search search={search} clear={clear}/>
            </div>
            <div className={styles.list}>
                <List list={list} play={play} download={download} fetchData={fetchData}/>
            </div>

            <div className={styles.player}>
                {currentSong ?
                    <Player url={url} currentSong={currentSong} lyricList={lryicRef.current} onEnd={onEnd}
                            openDownLoadList={openDownLoadList}/> : null}
            </div>
            {/*<DownloadList isShow={isShow}/>*/}
        </div>
    )
}

export default App




