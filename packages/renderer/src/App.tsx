import Search from "@/components/search";
import styles from '@/styles/app.module.scss'
import List from "@/components/list";
import {useCallback, useEffect, useRef, useState} from "react";
import {getSearchSongData, ISongProps} from "@/api";
import Player from "@/components/player";
import DownloadList from "@/components/download-list";
import Loading from "@/components/loading";
import {downloadProgressProps} from "../../main/music";


export interface downloadItempProps {
    progress: number,
    name: string,
    id: string | number,
    savePath: string,

}

const App = () => {
    const [list, setList] = useState<ISongProps[]>([])
    const [currentSong, setCurrentSong] = useState<ISongProps | null>(null)
    const [plusSong, setPlusSong] = useState<ISongProps | null>(null)
    const [offset, setOffset] = useState<number>(1)
    const keyRef = useRef<string>('')
    const [isShow, setIsShow] = useState(false)
    const [loading, setLoading] = useState(false)
    const search = useCallback((key: string) => {
        setLoading(true)
        keyRef.current = key
        if (key === '') {
            setOffset(1)
            setList([])
        }
        getSongList(key, offset)
    }, [offset])
    const clear = useCallback(() => {
        setList([])
        keyRef.current = ''
        setOffset(1)
    }, [])
    const downLoadMapRef = useRef<Map<number | string, downloadItempProps>>(new Map())
    const [downloadList, setDownloadList] = useState<downloadItempProps[]>([])
    useEffect(() => {
        window.ipcRenderer.on('download:end', (event, args) => {
            downloadProgress(args)
        })
    }, [])
    const downloadProgress = (args: downloadProgressProps) => {
        const {songId, progress, filePath} = args
        if (downLoadMapRef.current && downLoadMapRef.current.has(songId)) {
            const prevItem = downLoadMapRef.current.get(songId)!
            downLoadMapRef.current.set(songId, {...prevItem, savePath: filePath, progress: progress})
            handleDownloadList()
        }
    }
    const getSongList = (key: string, offset: number) => {
        getSearchSongData(key, offset).then(r => {
            if (r.code === 200) {
                const list = r.result.songs
                setList(l => Array.isArray(list) ? [...l, ...list] : l)
            }
        }).finally(() => {
            setLoading(false)
        })
    }

    const play = async (song: ISongProps) => {
        setCurrentSong(song)
        console.log(song, 'way')
    }
    const plus = async (song: ISongProps) => {
        setPlusSong(song)
    }
    const openDownLoadList = useCallback(() => {
        setIsShow(s => !s)
    }, [isShow])
    const download = (song: ISongProps) => {
        downLoadMapRef.current?.set(song.id, {name: song.name, progress: 0, savePath: '', id: song.id})
        handleDownloadList()
        window.ipcRenderer.send('download', song)
    }
    const handleDownloadList = () => {
        const list = [...downLoadMapRef.current.values()]
        setDownloadList(list)
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
                <List list={list} play={play} plus={plus} download={download} fetchData={fetchData}/>
            </div>

            <div className={styles.player}>

                <Player playSong={currentSong} openDownLoadList={openDownLoadList} plusSong={plusSong}
                />
            </div>
            <DownloadList isShow={isShow} list={downloadList}/>
            {
                loading ? <Loading/> : null
            }
        </div>
    )
}

export default App




