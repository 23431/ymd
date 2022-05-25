import Store from 'electron-store'

const store = new Store()
const Key = 'XJJJSCNNS'
export const setValue = (value: string) => {
    store.set(Key, value)
}

export const getValue = (): string => {

    return store.has(Key) ? store.get(Key) as unknown as string : ''
}
