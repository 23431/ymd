import app from './style.module.scss'
import React, {memo, useCallback, useEffect, useRef, useState} from "react";
import {findCurrentLineIndex, formateSongTime, LyricProsp} from "@/utils";
import {ISongProps} from "@/api";

interface IProps {
    url: string,
    currentSong: ISongProps | null,
    lyricList: LyricProsp[],
    onEnd: () => void,
    openDownLoadList: () => void
}

const Player = (props: IProps) => {
    const audioRef = useRef<null | HTMLAudioElement>(null)
    const [isPlay, setIsPlay] = useState(false)
    const timer = useRef<NodeJS.Timeout | null>(null)
    const [rotateCount, setRotateCount] = useState(0)
    const avatarRef = useRef<HTMLDivElement | null>(null)
    const [startTime, setStartTime] = useState("00:00")
    const [endTime, setEndTime] = useState("00:00")
    const innerRef = useRef<null | HTMLDivElement>(null)
    const barRef = useRef<null | HTMLDivElement>(null)
    const [playBtnCls, setPlayBtnCls] = useState('icon-play')
    const [lry, setLry] = useState('')
    const {url, currentSong, lyricList, onEnd,openDownLoadList} = props
    useEffect(() => {
        if (currentSong && currentSong.dt) {
            const endTime = formateSongTime(currentSong.dt / 1000)
            setEndTime(endTime)
        }
        return () => {
            setEndTime('00:00')
        }
    }, [currentSong])
    useEffect(() => {

        if (isPlay) {
            timer.current = setInterval(() => {
                setRotateCount(c => c + 1)
            }, 1000 / 60)
        } else {
            timer.current && window.clearInterval(timer.current)
        }
        return () => {
            timer.current && window.clearInterval(timer.current)
        }
    }, [isPlay])

    useEffect(() => {
        if (!avatarRef.current) return
        // @ts-ignore
        avatarRef.current.style.transform = `rotate(${rotateCount}deg)`
    }, [rotateCount])


    const player = (e: React.FormEvent<HTMLAudioElement>) => {
        e.currentTarget?.play()
    }
    const canPlay = (e: React.FormEvent<HTMLAudioElement>) => {
        e.currentTarget.play()
        setIsPlay(true)
    }
    const onTimeUpdate = (e: React.FormEvent<HTMLAudioElement>) => {

        const time = e.currentTarget.currentTime;
        // console.log(time);
        getCurrentLyric(time * 1000)
        const startTime = formateSongTime(time)
        setStartTime(startTime)
        updateBarWidth(time)
    }
    const getCurrentLyric = (time: number) => {
        const index = findCurrentLineIndex(time, lyricList)
        const lry = lyricList[index]
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
    const onEnded = (e: React.FormEvent<HTMLAudioElement>) => {
        setIsPlay(false)
        onEnd()

    }
    const updatePlay = useCallback(() => {
        const target = audioRef.current
        if (isPlay) {
            target?.pause()
            setIsPlay(false)
        } else {
            target?.play()
            setIsPlay(true)
        }
    }, [isPlay])
    useEffect(() => {
        setPlayBtnCls(isPlay ? 'icon-pause' : 'icon-play')
    }, [isPlay])
    return <div className={app.wrap}>
        <div className={app.content}>
            <div className={app.avatar}>
                <div className={app.avatarImg} ref={avatarRef} onClick={updatePlay}>
                    <img src={currentSong?.al.picUrl} alt=""/>
                </div>
            </div>
            <div className={app.main}>
                <div className={app.progress}>
                    <div className={app.startTime}>{startTime}</div>
                    <div className={app.inner} ref={innerRef}>
                        <div className={app.bar} ref={barRef}/>
                    </div>
                    <div className={app.endTime}>{endTime}</div>
                </div>
                <div className={app.control}>
                    <div className={app.lrc}>{lry}</div>
                    <div className={app.downloadList + ' ' + 'iconfont icon-download'} onClick={()=>openDownLoadList()} />
                </div>
            </div>

        </div>
        <audio src={url} ref={audioRef} onPlay={player} onCanPlay={canPlay} onTimeUpdate={onTimeUpdate}
               onEnded={onEnded}/>
    </div>
}

export default memo(Player)
