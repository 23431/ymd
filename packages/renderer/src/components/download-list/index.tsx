import app from '../play-list/style.module.scss'
import {memo} from "react";
import {downloadItempProps} from "@/App";

interface IProps {
    list: downloadItempProps[]
}

export const DownloadList = (props: IProps) => {
    const {list} = props
    const setStatusCls = (status: number) => {
        return status === 0 ? ' icon-download1 ' + app.download : ' icon-finish ' + app.finish
    }

    const calCls = (index: number) => {
        return (index % 2 !== 0) ? app.listItem + ' ' + app.stroke : app.listItem
    }
    return <div>{
        <div className={app.wrap}>
            <div className={app.main}>
                <div className={app.title}>
                    <h1>当前下载</h1>
                    <div className={app.subTitle}>总{list.length}首</div>
                </div>
                <div className={app.listWrap}>
                    <div className={app.list}>
                        {
                            list.map((item, index) => <div className={calCls(index)}>
                                <div className={app.name}>{item.name}</div>
                                <div className={app.name}>{item.savePath}</div>
                            </div>)
                        }
                    </div>
                </div>
            </div>
        </div>
    }</div>

}

export default memo(DownloadList)
