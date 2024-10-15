const getApiBaseUrl = () => {
    let url : string = process.env.API_BASE_URL || 'http://localhost:8080/'
    if (!url.endsWith('/')) {
        url = `${url}/`
    }
    return url
}

const API_BASE_URL : string = getApiBaseUrl()

export { API_BASE_URL }
