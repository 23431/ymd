import app from './style.module.scss'
import React, {memo, useState} from "react";
import useDebounce from "@/hooks/useDebounce";

interface IProps {
    search: (key: string) => void,
    clear: () => void
}

const Search = (props: IProps) => {
    const {search, clear} = props
    const [keyWorld, setKeyWorld] = useState<string>('')
    const searchHandler = () => {
        search(keyWorld)

    }
    useDebounce(searchHandler, 2000, keyWorld)
    const inputHandler = (event: React.FormEvent<HTMLInputElement>) => {
        const key = event.currentTarget.value
        setKeyWorld(key)
    }

    const btnSearch = () => {
        search && search(keyWorld)
    }
    const btnClear = () => {
        setKeyWorld('')
        clear && clear()
    }
    return <div className={app.wrap}>
        <div className={app.content}>
            <div className={app.inputContent}>
                <input type="text" value={keyWorld} placeholder={'请输入歌曲名称！！！'} onChange={inputHandler}/>
                <div className={app.clear} onClick={btnClear}>X</div>
            </div>
            {/*<div className={app.btn} onClick={btnSearch}>搜索</div>*/}
        </div>
    </div>
}

export default memo(Search)
