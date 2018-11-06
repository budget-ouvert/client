import {
    action,
} from '../types'

export const clickedSunburstPoint = (p: any): action => {
    return {
        type: 'CHANGED_SUNBURST_POINT',
        payload: p,
    }
}

export const fetchPlfFile = (url: string): any => {
    return (dispatch: any, getState: any) => {
        fetch(url).then((res: any) => {
            return res.text()
        }).then((res: any) => {
            dispatch(successFetchPlfFile(url, res))
        }).catch((err: any) => {
            console.log(err)
            dispatch(failedFetch(err))
        })
    }
}

export const successFetchPlfFile = (url: string, res: any): action => {
    let fileName = url.split('/')[-1];

    return {
        type: 'SUCCESS_FETCH_PLF_FILE',
        payload: {
            fileName: fileName,
            content: res,
        }
    }
}

export const failedFetch = (err: any): action => {
    return {
        type: 'FAILED_FETCH',
        payload: err,
    }
}
