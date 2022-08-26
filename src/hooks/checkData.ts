export function useCheckData() {
    const isData = (data: any) => data ? true : false

    return { isData }
}