import ReactDOM from "react-dom";
import app from './style.module.scss'

const Loading = () => {
    const Wrap = () => {
        return <div className={app.wrap}>
            <div  className={app.content}/>
        </div>
    }

    return ReactDOM.createPortal(<Wrap/>, document.body)
}

export default Loading
