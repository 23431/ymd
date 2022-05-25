import ReactDOM from "react-dom";
import app from './style.module.scss'
import {memo, useEffect, useRef} from "react";

interface IProps {
    isShow: boolean
}

export const DownloadList = (props: IProps) => {
    const {isShow} = props

    const wrapRef = useRef<HTMLDivElement | null>(null)

    const Wrap = () => {

        return <div className={app.wrap}>
            <div className={app.content} ref={wrapRef}>
                待实现
            </div>
        </div>
    }

    return ReactDOM.createPortal(<Wrap/>, document.body)

}

export default memo(DownloadList)
