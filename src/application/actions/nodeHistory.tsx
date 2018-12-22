import {
    IAction,
} from '../types'

const BACKEND_URL = (process.env.NODE_ENV === 'development') ?
    'http://127.0.0.1:5000' :
    'https://api.budget.parlement-ouvert.fr'

export const fetchHistory = (year: string, code: string): IAction => {
    return (dispatch: any, getState: any) => {
        dispatch(loadingHistory())

        const url = `${BACKEND_URL}/node_history/${year}/${code}`

        fetch(url).then((response: any) => {
            return response.json()
        }).then((response: any) => {
            dispatch(fetchHistorySuccess(response))
        }).catch((err: any) => {
            console.log(err)
            dispatch(fetchHistoryFailure(err))
        })
    }
}

export const loadingHistory = (): IAction => {
    return {
        type: 'LOADING_HISTORY',
    }
}

export const fetchHistorySuccess = (response: any): IAction => {
    return {
        type: 'FETCH_HISTORY_SUCCESS',
        payload: response,
    }
}

export const fetchHistoryFailure = (err: any): IAction => {
    return {
        type: 'FETCH_HISTORY_FAILURE',
        payload: err,
    }
}
