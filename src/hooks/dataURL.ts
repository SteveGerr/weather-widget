export function useDataURL() {
    const getDataURL = (BASE_URL:string, query:string, API_key:string) => `${BASE_URL}weather?q=${ query }&units=metric&appid=${API_key}`
    return { getDataURL }
}