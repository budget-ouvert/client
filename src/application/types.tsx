import * as redux from 'redux'

// Redux types
export interface simpleAction {
    type: string,
    payload?: any,
}

export type thunkAction = (dispatch: redux.Dispatch<any>, getState: any) => void

export type action = simpleAction | thunkAction

// VIEWS

interface IView {
    dispatch?: any,
}

// Main view
export interface ISunburstView extends IView {
    sunburst: ISunburstState,
}

export interface ISunburstState {
    data: any,
    dataLoadedTime: number,
    selectedPath: any,
}

// Verification view
export interface IVerificationView extends IView {
    verification: IVerificationState,
}

export interface IVerificationState {
    loading: boolean,
    sourceExit: string,
    targetExit: string,
    availableYears: string[],
    currentSuggestion: number,
    selectedYear: string,
    suggestionList: ISuggestionSource[],
    sourcePlf: IPlf,
    targetPlf: IPlf,
    votes: IVotes,
}

export interface IPlf {
    [id: string]: string[],
}

export interface IVotes {
    [source_id: string]: {
        [target_id: string]: ISuggestion,
    }
}

export interface ISuggestion {
    distance: number,
    upvotes: number,
    downvotes: number,
    commentaires: string[],
}

export interface ISuggestionSource {
    source_id: string,
    targets: ISuggestionTarget[],
}

export interface ISuggestionTarget extends ISuggestion {
    target_id: string,
}
