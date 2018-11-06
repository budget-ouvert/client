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
    IVerificationState,
} from '../types'

const loadNumberCsv = (csv: string) : any => {
    let rows = d3.dsvFormat(';').parseRows(csv).map((row: any) => {
        let parsedRow : number[] = []

        for (let i = 0; i < row.length; i++) {
            parsedRow.push(+row[i])
        }

        return parsedRow
    })

    return rows
}

const plfCSVToPlfDict = (csv: string) : any => {
    let plfDict: any = {}

    let rows = d3.dsvFormat(';').parseRows(csv)

    for (let i = 0; i < rows.length; i++) {
        let nameList = []

        for (let j = 0; j < Math.floor(rows[i].length / 2); j++) {
            if (rows[i][2*j] == '') {
                break
            } else {
                nameList.push(rows[i][2*j])
            }
        }

        plfDict[i] = nameList
    }

    return plfDict
}

const neighborsCSVToSuggestionList = (csv: string) : any => {
    let suggestionList = []

    let rows = loadNumberCsv(csv)

    for (let i = 0; i < rows.length; i++) {
        suggestionList.push({
            source_id: i,
            target_id: rows[i][0],
            distance: rows[i][1],
            nearestNeighbors: rows[i].splice(2, rows[i].length - 2),
        })
    }

    return suggestionList
}

const votesCSVToVotesDict = (csv: string) : any => {
    let votesDict : any = {}

    let rows = loadNumberCsv(csv)

    for (let i = 0; i < rows.length; i++) {
        if (!votesDict[rows[i][0]]) {
            votesDict[rows[i][0]] = {}
        }

        votesDict[rows[i][0]][rows[i][1]] = {
            distance: rows[i][2],
            upvotes: rows[i][3],
            downvotes: rows[i][4],
        }
    }

    return votesDict
}

const votes = votesCSVToVotesDict(votesCsv)
let suggestionList = neighborsCSVToSuggestionList(neighborsCsv).sort((a: any, b: any) => {
    const upvotes_a = votes[a.source_id] ?
        (votes[a.source_id][a.target_id] ?
            votes[a.source_id][a.target_id].upvotes : 0) : 0
    const downvotes_a = votes[a.source_id] ?
        (votes[a.source_id][a.target_id] ?
            votes[a.source_id][a.target_id].downvotes : 0) : 0
    const upvotes_b = votes[b.source_id] ?
        (votes[b.source_id][b.target_id] ?
            votes[b.source_id][b.target_id].upvotes : 0) : 0
    const downvotes_b = votes[b.source_id] ?
        (votes[b.source_id][b.target_id] ?
            votes[b.source_id][b.target_id].downvotes : 0) : 0

    return  (downvotes_b - upvotes_b) - (downvotes_a - upvotes_a)
})

const initialState: IVerificationState = {
    availableYears: ['2012', '2013'],
    currentSuggestion: 0,
    selectedYear: null,
    suggestionList,
    sourcePlf: plfCSVToPlfDict(sourcePlfCsv),
    targetPlf: plfCSVToPlfDict(targetPlfCsv),
    votes,
}

const verification = (state = initialState, action: simpleAction): IVerificationState => {
    switch (action.type) {
        case 'UPDATE_SELECTED_YEAR':
            return {
                ...state,
                selectedYear: action.payload,
            }

        case 'NEXT_SUGGESTION':
            return {
                ...state,
                currentSuggestion: (state.currentSuggestion + 1) % state.suggestionList.length,
            }

        default:
            return state
    }
}

export default verification
