import * as d3 from 'd3'

// Import mock data
import {
    neighborsCsv,
    sourcePlfCsv,
    targetPlfCsv,
    votesCsv,
} from '../mockdata/verification'

// Import custom types
import {
    simpleAction,
    IPlf,
    ISuggestion,
    ISuggestionSource,
    IVerificationState,
    IVotes,
} from '../types'

const plfCSVToPlfDict = (csv: string) : IPlf => {
    let plfDict: IPlf = {}

    let rows = d3.dsvFormat(';').parseRows(csv)

    // Start from 1 to skip file header
    for (let i = 1; i < rows.length; i++) {
        let nameList = []

        for (let j = 0; j < Math.floor((rows[i].length - 1) / 2); j++) {
            if (rows[i][1 + 2*j] == '') {
                break
            } else {
                nameList.push(rows[i][1 + 2*j])
            }
        }

        plfDict[`${i-1}`] = nameList
    }

    return plfDict
}

const suggestionListFromVotes = (votes: IVotes) : ISuggestionSource[] => {
    let suggestionList: any = []

    for (let source_id in votes) {
        const targets = Object.keys(votes[source_id])
            .sort((a: string, b: string) : number => {
                return votes[source_id][a].distance - votes[source_id][b].distance
            })
            .map((target_id: string) => {
                return {
                    target_id,
                    ...votes[source_id][target_id],
                }
            })

        if (votes[source_id][targets[0].target_id].distance > votes[source_id][targets[1].target_id].distance) {
            console.log('WTF bro')
        }

        const currentSuggestion : any = {
            source_id,
            targets,
        }

        suggestionList.push(currentSuggestion)
    }

    return suggestionList.sort((a: ISuggestionSource, b: ISuggestionSource) : number => {
        const a_suggestion = a.targets[0]
        const b_suggestion = b.targets[0]
        return (b_suggestion.distance + b_suggestion.downvotes - b_suggestion.upvotes) - (a_suggestion.distance + a_suggestion.downvotes - a_suggestion.upvotes)
    })
}

const initialState: IVerificationState = {
    loading: false,
    sourceExit: 'next',
    targetExit: 'next',
    availableYears: ['2012', '2013', '2014', '2015', '2016', '2017'],
    currentSuggestion: 0,
    selectedYear: null,
    suggestionList: [],
    sourcePlf: null,
    targetPlf: null,
    votes: null,
}

const verification = (state = initialState, action: simpleAction): IVerificationState => {
    switch (action.type) {
        case 'LOADING':
            return {
                ...state,
                loading: true,
            }

        case 'UPDATE_SELECTED_YEAR':
            return {
                ...state,
                selectedYear: action.payload,
                loading: false,
            }

        case 'PREVIOUS_SUGGESTION':
            return {
                ...state,
                currentSuggestion: (state.currentSuggestion - 1 + state.suggestionList.length) % state.suggestionList.length,
                sourceExit: 'previous',
                targetExit: 'previous',
            }

        case 'NEXT_SUGGESTION':
            return {
                ...state,
                currentSuggestion: (state.currentSuggestion + 1) % state.suggestionList.length,
                sourceExit: action.payload.exitClass,
                targetExit: action.payload.exitClass,
            }

        // Deprecated: no need to update the state?
        case 'DOWNVOTE_SUGGESTION': {
            const {
                source_id,
                target_id,
                distance,
            } = action.payload
            let votes = state.votes

            if (votes[source_id]) {
                if (votes[source_id][target_id]) {
                    votes[source_id][target_id].downvotes += 1
                } else {
                    votes[source_id][target_id] = {
                        distance,
                        upvotes: 0,
                        downvotes: 1,
                        commentaires: [],
                    }
                }
            } else {
                votes[source_id] = {}
                votes[source_id][target_id] = {
                    distance,
                    upvotes: 0,
                    downvotes: 1,
                    commentaires: [],
                }
            }

            return {
                ...state,
                votes,
                targetExit: 'downvote',
            }
        }

        // Deprecated: no need to update the state?
        case 'UPVOTE_SUGGESTION': {
            const {
                source_id,
                target_id,
                distance,
            } = action.payload
            let votes = state.votes

            if (votes[source_id]) {
                if (votes[source_id][target_id]) {
                    votes[source_id][target_id].upvotes += 1
                } else {
                    votes[source_id][target_id] = {
                        distance,
                        upvotes: 1,
                        downvotes: 0,
                        commentaires: [],
                    }
                }
            } else {
                votes[source_id] = {}
                votes[source_id][target_id] = {
                    distance,
                    upvotes: 1,
                    downvotes: 0,
                    commentaires: [],
                }
            }

            return {
                ...state,
                votes,
            }
        }

        case 'NEXT_NEIGHBOR': {
            let {
                currentSuggestion,
                suggestionList,
            } = state

            suggestionList[currentSuggestion].targets.shift()

            return {
                ...state,
                suggestionList,
                targetExit: 'downvote',
            }
        }

        case 'RECEIVED_VOTES':
            return {
                ...state,
                votes: action.payload,
                suggestionList: suggestionListFromVotes(action.payload),
            }

        case 'RECEIVED_PLF': {
            switch (action.payload.destination) {
                case 'source':
                    return {
                        ...state,
                        sourcePlf: plfCSVToPlfDict(action.payload.content),
                    }

                case 'target':
                    return {
                        ...state,
                        targetPlf: plfCSVToPlfDict(action.payload.content),
                    }

                default:
                    return state
            }
        }

        default:
            return state
    }
}

export default verification
