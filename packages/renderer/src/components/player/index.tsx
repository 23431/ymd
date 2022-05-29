import app from './style.module.scss'
import React, {memo, useCallback, useEffect, useRef, useState} from "react";
import {useTransition} from 'transition-hook';
import {findCurrentLineIndex, formateSongTime, hanldrLyric, LyricProsp} from "@/utils";
import {checkMuisicIsAvailable, getLyric, getMusicUrl, ISongProps} from "@/api";
import MusicImg from './music.png'
import PlayList from "@/components/play-list";

interface IProps {
    playSong: ISongProps | null,
    plusSong: ISongProps | null,
    openDownLoadList: () => void
}

const Player = (props: IProps) => {
    const audioRef = useRef<null | HTMLAudioElement>(null)
    const [isPlay, setIsPlay] = useState(false)
    const [currentSong, setCurrentSong] = useState<ISongProps | null>(null)
    const timer = useRef<NodeJS.Timeout | null>(null)
    const lryicList = useRef<LyricProsp[]>([])
    const [playList, setPlayList] = useState<ISongProps[]>([])
    const [rotateCount, setRotateCount] = useState(0)
    const avatarRef = useRef<HTMLDivElement | null>(null)
    const [startTime, setStartTime] = useState("00:00")
    const [endTime, setEndTime] = useState("00:00")
    const innerRef = useRef<null | HTMLDivElement>(null)
    const barRef = useRef<null | HTMLDivElement>(null)
    const [playBtnCls, setPlayBtnCls] = useState(' icon-play-filling ')
    const currentSongIndexRef = useRef(0)
    const [lry, setLry] = useState('')
    const [url, setUrl] = useState<string>('')
    const [showPL, setShowPL] = useState(false)
    const [showLry, setShowLry] = useState(false)
    const {stage, shouldMount} = useTransition(showLry, 300)
    const {playSong, plusSong, openDownLoadList} = props
    useEffect(() => {
        if (currentSong && currentSong.dt) {
            play(currentSong)

            const endTime = formateSongTime(currentSong.dt / 1000)
            setEndTime(endTime)
        } else {
            setStartTime('00:00')
            setEndTime('00:00')
            play(null)
        }
        return () => {
            setEndTime('00:00')
        }
    }, [currentSong])
    useEffect(() => {
        if (!plusSong) return
        setPlayList(l => {
            const findIndex = l.findIndex(s => s.id === plusSong?.id)
            if (findIndex === -1) {
                return [...l, plusSong]
            }
            return l
        })
    }, [plusSong])
    useEffect(() => {
        if (!playSong) return
        const index = playList.findIndex(s => s?.id === playSong?.id)
        if (index === -1 && playSong) {
            setPlayList(l => [...l, playSong])
            currentSongIndexRef.current = playList.length
        } else {
            currentSongIndexRef.current = index
        }
        setCurrentSong(playSong)
    }, [playSong])
    useEffect(() => {
        console.log(playList)
    }, [playList])
    useEffect(() => {
        const audio = audioRef.current
        if (isPlay) {
            timer.current = setInterval(() => {
                setRotateCount(c => c + 1)
            }, 1000 / 60)
        } else {
            timer.current && window.clearInterval(timer.current)
            audio?.pause()
        }
        return () => {
            timer.current && window.clearInterval(timer.current)
        }
    }, [isPlay])
    const onLryicClick = () => {
        setShowLry(l => !l)
    }
    const play = async (song: ISongProps | null) => {
        if (!song) {
            setUrl('')
            lryicList.current = []
            return
        }
        const id = song.id
        const result = await checkMuisicIsAvailable(id)
        if (result.success) {
            const result = await getMusicUrl(id)
            const lrcResult = await getLyric(id)
            if (lrcResult.code === 200) {
                lryicList.current = hanldrLyric(lrcResult.lrc.lyric)
            }
            if (result.code === 200) {
                const urls = result.data
                if (Array.isArray(urls) && urls.length > 0 && urls[0].url) {
                    setUrl(urls[0].url)
                }
            }
        }
    }
    useEffect(() => {
        if (!avatarRef.current) return
        // @ts-ignore
        avatarRef.current.style.transform = `rotate(${rotateCount}deg)`
    }, [rotateCount])

    const canPlay = (e: React.FormEvent<HTMLAudioElement>) => {
        e.currentTarget.play()
        setIsPlay(true)
    }
    const onTimeUpdate = (e: React.FormEvent<HTMLAudioElement>) => {

        const time = e.currentTarget.currentTime;
        getCurrentLyric(time * 1000)
        const startTime = formateSongTime(time)
        setStartTime(startTime)
        updateBarWidth(time)
    }
    const getCurrentLyric = (time: number) => {
        const index = findCurrentLineIndex(time, lryicList.current)
        if (index === -1) {
            setLry('')
            return
        }
        const lry = lryicList.current[index]
        setLry(lry.text)
    }
    const updateBarWidth = (currentTime: number) => {
        const wrapWidth = innerRef.current?.offsetWidth
        const target = barRef.current
        if (currentSong?.dt && target && wrapWidth) {
            const percent = currentTime / (currentSong.dt / 1000)
            target.style.width = wrapWidth * percent + 'px'
        }

    }
    const onEnded = useCallback((e: React.FormEvent<HTMLAudioElement>) => {
        setIsPlay(false)
        if (currentSongIndexRef.current === playList.length - 1) {
            currentSongIndexRef.current = 0
        } else {
            currentSongIndexRef.current++
        }
        setCurrentSong({...playList[currentSongIndexRef.current]})
    }, [playList])
    const onRemove = useCallback((id: string | number) => {
        if (playList.length === 1) {
            setIsPlay(false)
            setPlayList([])
            setCurrentSong(null)
            return
        }
        const removeIndex = playList.findIndex(s => s.id === id)
        let nextIndex = 0;
        if (removeIndex === playList.length - 1) {
            nextIndex = 0
        } else if (removeIndex === 0) {
            nextIndex = removeIndex + 1
        } else {
            nextIndex = removeIndex + 1
        }
        currentSongIndexRef.current = nextIndex
        setCurrentSong(playList[nextIndex])
        setPlayList(l => l.filter(s => s.id !== id))
    }, [currentSong, isPlay, playList])
    const onShowPlayList = () => {
        setShowPL(s => !s)
    }
    const updatePlay = useCallback(() => {
        if (!url) return
        const target = audioRef.current
        if (isPlay) {
            target?.pause()
            setIsPlay(false)
        } else {
            target?.play()
            setIsPlay(true)
        }
    }, [isPlay, url])
    const playOrPause = useCallback((song: ISongProps, isPlaying: boolean) => {
        const target = audioRef.current
        if (currentSong?.id === song.id && url) {
            if (isPlaying) {
                target?.pause()
                setIsPlay(false)
            } else {
                target?.play()
                setIsPlay(true)
            }
        } else if (!url || currentSong?.id !== song.id) {
            setCurrentSong(song)
        }
    }, [currentSong, url])
    const onLeftClick = useCallback(() => {
        if (currentSongIndexRef.current === 0) {
            currentSongIndexRef.current = playList.length
        }
        currentSongIndexRef.current--
        setCurrentSong(playList[currentSongIndexRef.current])
    }, [playList])
    const onRightClick = useCallback(() => {
        if (currentSongIndexRef.current === playList.length - 1) {
            currentSongIndexRef.current = 0
        }
        currentSongIndexRef.current++
        setCurrentSong(playList[currentSongIndexRef.current])
    }, [playList])
    useEffect(() => {
        setPlayBtnCls(isPlay ? ' icon-pausecircle-fill ' : ' icon-play-filling ')
    }, [isPlay])
    return <div className={app.wrap}>
        <div className={app.content}>
            <div className={app.progress} ref={innerRef}>
                <div className={app.inner} ref={barRef}/>
            </div>
            <div className={app.main}>
                <div className={app.control}>
                    <div className={app.songInfo}>
                        <div className={app.avatar}>
                            <img src={currentSong?.al.picUrl} alt=""/>
                        </div>
                        <div className={app.textInfo}>
                            <div className={app.name}>{currentSong?.name}</div>
                            <div className={app.time}>
                                {startTime} / {endTime}
                            </div>
                        </div>
                    </div>
                    <div className={app.btns}>
                        <span className={'iconfont icon-left ' + app.left} onClick={onLeftClick}/>
                        <span className={'iconfont  ' + playBtnCls + app.play} onClick={updatePlay}/>
                        <span className={'iconfont icon-right ' + app.right} onClick={onRightClick}/>
                    </div>
                    <div className={app.icons}>
                        <span className={'iconfont icon-wodexiazailiebiao ' + app.icon} onClick={openDownLoadList}/>
                        <span className={'iconfont icon-list ' + app.icon}
                              onClick={onShowPlayList}/>
                        <span className={'iconfont icon-cibiaoquanyi ' + app.icon} onClick={onLryicClick}/>
                    </div>
                </div>
                {
                    shouldMount && <div className={app.lryic} onClick={onLryicClick} style={{
                        transition: '.3s',
                        height: stage === 'enter' ? '60px' : '0px'
                    }}>
                        <div className={app.lryText}>{lry}</div>
                    </div>
                }
            </div>
        </div>
        <PlayList show={showPL} list={playList} currrentSongId={currentSong?.id ?? ''} isPlaying={isPlay}
                  playOrPause={playOrPause} onRemove={onRemove}/>
        <audio src={url} ref={audioRef} onCanPlay={canPlay} onTimeUpdate={onTimeUpdate}
               onEnded={onEnded}/>
    </div>
}

export default Player
