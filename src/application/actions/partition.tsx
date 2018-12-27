import {
    IAction,
} from '../types'

const BACKEND_URL = (process.env.NODE_ENV === 'development') ?
    'http://127.0.0.1:5000' :
    'https://api.budget.parlement-ouvert.fr'

export const fetchPartition = (source: string, year: string, callback: any): IAction => {
    return (dispatch: any, getState: any) => {
        dispatch(loadingPartition())

        const url = `${BACKEND_URL}/hierarchy/${source}/${year}`

        fetch(url).then((response: any) => {
            return response.text()
        }).then((response: any) => {
            dispatch(fetchPartitionSuccess(`${source}-${year}`, response))
            callback()
        }).catch((err: any) => {
            console.log(err)
            dispatch(fetchPartitionFailure(err))
        })
    }
}

export const loadingPartition = (): IAction => {
    return {
        type: 'LOADING_PARTITION',
    }
}

export const fetchPartitionSuccess = (year: string, response: any): IAction => {
    return {
        type: 'FETCH_PARTITION_SUCCESS',
        payload: {
            key: year,
            content: response,
        }
    }
}

export const fetchPartitionFailure = (err: any): IAction => {
    return {
        type: 'FETCH_PARTITION_FAILURE',
        payload: err,
    }
}
