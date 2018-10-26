import {action} from './types'

export function clickedSunburstPoint(p: any): action {
    return {
        type: 'CHANGED_SUNBURST_POINT',
        value: p,
    }
}
