import {action} from './types'

export function clickedSunburstPoint(p: any): action {
    return {
        type: 'CHANGED_SUNBURST_POINT',
        value: p,
    }
}

export function fetchPlfFile(url: string): action {
    return {
        type: 'FETCH_PLF_FILE',
        promise: (dispatch, getState) => {
            fetch(url).then((res: any) => {
                return res.text()
            }).then((res: any) => {
                dispatch(successFetchPlfFile(url, res))
            }).catch((err: any) => {
                console.log(err)
                dispatch(failedFetch(err))
            })
        },
    }
}

export function successFetchPlfFile(url: string, res: any): action {
    let fileName = url.split('/')[-1];

    return {
        type: 'SUCCESS_FETCH_PLF_FILE',
        value: {
            fileName: fileName,
            content: res,
        }
    }
}


export function failedFetch(err: any): action {
    return {
        type: 'FAILED_FETCH',
        value: err,
    }
}
