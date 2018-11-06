import {
    action,
} from '../types'

export const updateSelectedYear = (selectedYear: string) => {
    return {
        type: 'UPDATE_SELECTED_YEAR',
        payload: selectedYear,
    }
}
