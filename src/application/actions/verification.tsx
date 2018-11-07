import {
    action,
} from '../types'

export const nextSuggestion = () : action => {
    return {
        type: 'NEXT_SUGGESTION',
    }
}

export const previousSuggestion = () : action => {
    return {
        type: 'PREVIOUS_SUGGESTION',
    }
}

export const downvoteCurrentSuggestion = () : action => {
    return (dispatch: any, getState: any) => {
        const state = getState()
        const suggestion = state.verification.suggestionList[state.verification.currentSuggestion]

        // Update votes in state
        dispatch(downvoteSuggestion(suggestion.source_id, suggestion.target_id, suggestion.distance))

        // Update current suggestion with nearestNeighbors
        if (suggestion.nearestNeighbors.length > 1) {
            // Call nextNeighbor only if there actually are neighbors to be tested
            dispatch(nextNeighbor())
        } else {
            // Otherwise, simply return the next suggestion
            dispatch(nextSuggestion())
        }
    }
}

export const downvoteSuggestion = (source_id: number, target_id: number, distance: number) : action => {
    return {
        type: 'DOWNVOTE_SUGGESTION',
        payload: {
            source_id,
            target_id,
            distance,
        }
    }
}

export const nextNeighbor = () : action => {
    return {
        type: 'NEXT_NEIGHBOR',
    }
}

export const updateSelectedYear = (selectedYear: string) : action => {
    return {
        type: 'UPDATE_SELECTED_YEAR',
        payload: selectedYear,
    }
}
