import {
    action,
    IVerificationView,
} from '../types'

export const nextSuggestion = (exitClass: string) : action => {
    return {
        type: 'NEXT_SUGGESTION',
        payload: {
            exitClass,
        },
    }
}

export const previousSuggestion = () : action => {
    return {
        type: 'PREVIOUS_SUGGESTION',
    }
}

export const downvoteCurrentSuggestion = () : action => {
    return (dispatch: any, getState: any) => {
        const state : IVerificationView = getState()
        const suggestion = state.verification.suggestionList[state.verification.currentSuggestion]

        // TODO : send downvote to server

        // Update current suggestion with nearestNeighbors
        if (suggestion.targets.length > 0) {
            // Call nextNeighbor only if there actually are neighbors to be tested
            dispatch(nextNeighbor())
        } else {
            // Otherwise, simply return the next suggestion
            dispatch(nextSuggestion('next'))
        }
    }
}

// Deprecated: no need to update the state?
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

export const upvoteCurrentSuggestion = () : action => {
    return (dispatch: any, getState: any) => {
        const state = getState()
        const suggestion = state.verification.suggestionList[state.verification.currentSuggestion]

        // TODO: send upvote to server

        dispatch(nextSuggestion('upvote'))
    }
}

// Deprecated: no need to update the state?
export const upvoteSuggestion = (source_id: number, target_id: number, distance: number) : action => {
    return {
        type: 'UPVOTE_SUGGESTION',
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

export const changeSelectedYear = (selectedYear: string) : action => {
    return (dispatch: any, getState: any) => {
        dispatch(loading())

        Promise.all([
            dispatch(fetchVotes(`http://api.live.rollin.ovh/plf_mappings/plf${selectedYear}_to_plf${Number(selectedYear) + 1}.json`)),
            dispatch(fetchPlf(`http://api.live.rollin.ovh/plf_all_nodes/plf${selectedYear}.csv`, 'source')),
            dispatch(fetchPlf(`http://api.live.rollin.ovh/plf_all_nodes/plf${Number(selectedYear) + 1}.csv`, 'target'))
        ]).then(() => {
            dispatch(updateSelectedYear(selectedYear))
        })
    }
}

export const loading = () => {
    return {
        type: 'LOADING',
    }
}

export const updateSelectedYear = (selectedYear: string) : action => {
    return {
        type: 'UPDATE_SELECTED_YEAR',
        payload: selectedYear,
    }
}

export const fetchVotes = (url: string) : action => {
    return (dispatch: any, getState: any) => {
        return fetch(url).then((response: any) => {
            return response.json()
        }).then((response: any) => {
            dispatch(receivedVotes(response))
        }).catch((err: any) => {
            console.log(err)
            dispatch(faildedVotes(err))
        })
    }
}

export const receivedVotes = (response: any) : action => {
    return {
        type: 'RECEIVED_VOTES',
        payload: response,
    }
}

export const faildedVotes = (err: any) : action => {
    return {
        type: 'FAILED_VOTES',
        payload: err,
    }
}

export const fetchPlf = (url: string, destination: string) : action => {
    return (dispatch: any, getState: any) => {
        return fetch(url).then((response: any) => {
            return response.text()
        }).then((response: any) => {
            dispatch(receivedPlf(response, destination))
        }).catch((err: any) => {
            console.log(err)
            dispatch(faildedPlf(err))
        })
    }
}

export const receivedPlf = (response: any, destination: string) : action => {
    return {
        type: 'RECEIVED_PLF',
        payload: {
            destination,
            content: response,
        }
    }
}

export const faildedPlf = (err: any) : action => {
    return {
        type: 'FAILED_PLF',
        payload: err,
    }
}
