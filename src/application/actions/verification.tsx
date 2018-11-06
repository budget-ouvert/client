import {
    action,
} from '../types'

export const nextSuggestion = () => {
    return {
        type: 'NEXT_SUGGESTION',
    }
}

export const updateSelectedYear = (selectedYear: string) => {
    return {
        type: 'UPDATE_SELECTED_YEAR',
        payload: selectedYear,
    }
}
