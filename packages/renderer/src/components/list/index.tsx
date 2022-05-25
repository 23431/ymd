import app from './style.module.scss'
import {ISongProps} from "@/api";
import React, {memo, useRef} from "react";


interface IProps {
    list: ISongProps[],
    play: (song: ISongProps) => void,
    download: (song: ISongProps) => void,
    fetchData: () => void
}

const List = (props: IProps) => {
    const {list, play, download, fetchData} = props
    const wrapRef = useRef<HTMLDivElement | null>(null)
    const contentRef = useRef<HTMLDivElement | null>(null)


    const onScroll = (event: React.FormEvent<HTMLDivElement>) => {

        const target = event.currentTarget
        const scrollTop = target.scrollTop
        const offsetHeight = target.offsetHeight
        const scrollHeight = target.scrollHeight

        if ((scrollTop + offsetHeight + 50) > scrollHeight) {
            fetchData()
        }
    }

    return <div className={app.wrap} ref={wrapRef}>
        <div className={app.content} ref={contentRef} onScroll={onScroll}>
            <div className={app.list}>
                {
                    list.map((s,index) => <div className={app.listItem} key={index}>
                        <div className={app.info}>
                            <div className={app.name}>{s.name}---{s.al?.name ?? s?.ar ?? s.ar[0].name}</div>
                        </div>
                        <div className={app.control}>
                            <div className={app.play +' '+'iconfont icon-play'} onClick={() => play(s)} />
                            <div className={app.download + ' ' + 'iconfont icon-download'} onClick={() => download(s)} />
                        </div>
                    </div>)
                }
            </div>
        </div>
    </div>
}

export default memo(List)
