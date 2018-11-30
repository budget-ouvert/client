import {
    IAction,
} from '../types'

export const fetchPartition = (url: string): IAction => {
    return (dispatch: any, getState: any) => {
        dispatch(loadingPartition())

        fetch(url).then((response: any) => {
            return response.text()
        }).then((response: any) => {
            dispatch(fetchPartitionSucess(url, response))
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

export const fetchPartitionSucess = (url: string, response: any): IAction => {
    let fileName = url.split('/')[-1];

    return {
        type: 'FETCH_PARTITION_SUCCESS',
        payload: {
            fileName: fileName,
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
