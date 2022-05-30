import app from './style.module.scss'
import {useTransition} from 'transition-hook'
import {PropsWithChildren} from "react";

interface Iprops {
    show: boolean,
    children:JSX.Element
}

const Modal = (props: PropsWithChildren<Iprops>) => {
    const {children, show} = props
    const {stage, shouldMount} = useTransition(show, 300)
    return (
        <div>
            shouldMount && <div className={app.wrap} style={{
            transition: '.3s',
            width: stage === 'enter' ? '500px' : '0'
        }}>
            {children}
        </div>
        </div>
    )
}
export default Modal
