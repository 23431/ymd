import {useEffect, useRef} from "react";

export default function useDebounce(func: Function, wait: number, deps: any) {

    const timer = useRef<NodeJS.Timeout | null>(null)
    useEffect(() => {
        if (timer.current) {
            clearTimeout(timer.current)
        }
        timer.current = setTimeout(() => func(), wait)
    }, [deps])


}
