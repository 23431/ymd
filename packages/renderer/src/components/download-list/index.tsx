import app from './style.module.scss'
import {memo, useEffect, useRef} from "react";
import {downloadItempProps} from "@/App";
import {useTransition} from 'transition-hook'

interface IProps {
    isShow: boolean,
    list: downloadItempProps[]
}

export const DownloadList = (props: IProps) => {
    const {isShow, list} = props
    console.log(isShow);
    const {stage, shouldMount} = useTransition(isShow, 300)
    const setStatusCls = (status: number) => {
        return status === 0 ? ' icon-download1 ' + app.download : ' icon-finish ' + app.finish
    }

    const calStatusCls = (index: number) => {
        const cls = (index % 2 === 0) ? app.stroke : ''
        return cls + ' ' + app.mainItem
    }
    return <div>{
        shouldMount && <div className={app.wrap} style={{
            transition: '.3s',
            width: stage === 'enter' ? '500px' : 0
        }}>
            <div className={app.content}>
                <div className={app.main}>
                    {
                        list.map((item, index) => {
                            return <div className={calStatusCls(index)} key={index}>
                                <div className={app.bar}>bar</div>
                                <div className={app.index}>{index + 1}.</div>
                                <div className={app.name}>{item.name}</div>
                                <div className={app.filePath}>{item.savePath}</div>
                                <div className={app.status + ' iconfont ' + setStatusCls(item.progress)}/>
                            </div>
                        })
                    }
                </div>
            </div>
        </div>
    }</div>

}

export default memo(DownloadList)
