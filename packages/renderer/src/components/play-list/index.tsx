import app from './style.module.scss'
import ReactDOM from "react-dom";
import {useTransition} from "transition-hook";
import {ISongProps} from "@/api";

interface IProps {
    list: ISongProps[],
    currrentSongId: string | number,
    isPlaying: boolean,
    playOrPause: (id: ISongProps, isPlaying: boolean) => void,
    onRemove: (id: string | number) => void
}

const PlayList = (props: IProps) => {
    const { list, currrentSongId, isPlaying, playOrPause, onRemove} = props
    const calItemCls = (index: number, id: string | number) => {
        const isStroke = (index % 2 !== 0) ? app.listItem + ' ' + app.stroke : app.listItem
        const isActive = currrentSongId === id ? ` ${app.isActive} ` : ''
        return isStroke + isActive
    }
    const calPlayBtnCls = (id: string | number) => {
        if (isPlaying && id === currrentSongId) {
            return ' iconfont icon-pause1 '
        } else {
            return ' iconfont icon-play '
        }
    }
    return <div>
        {
            (<div className={app.wrap}>
                <div className={app.main}>
                    <div className={app.title}>
                        <h1>当前播放</h1>
                        <div className={app.subTitle}>总{list.length}首</div>
                    </div>
                    <div className={app.listWrap}>
                        <div className={app.list}>
                            {
                                list.map((item, index) => (
                                    <div className={calItemCls(index, item.id)} key={item.id}>
                                        <div className={app.active}/>
                                        <div className={app.name}>{item.name}</div>
                                        <div className={app.control}>
                                            <div className={app.play + calPlayBtnCls(item.id)}
                                                 onClick={() => playOrPause(item, isPlaying)}/>
                                            <div className={app.remove + ' iconfont icon-clear '}
                                                 onClick={() => onRemove(item.id)}/>
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                </div>
            </div>)
        }
    </div>
}

export default PlayList
