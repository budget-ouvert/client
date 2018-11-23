import {
    IAction,
} from '../../types'

export const changeSelectedPoint = (p: any): IAction => {
    return {
        type: 'CHANGED_SELECTED_POINT',
        payload: p,
    }
}
