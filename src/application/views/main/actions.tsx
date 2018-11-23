import {
    IAction,
} from '../../types'

export const changeSelectedPoint = (path: any, size: number): IAction => {
    return {
        type: 'CHANGED_SELECTED_POINT',
        payload: {
            path,
            size,
        }
    }
}
