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
    availableYears: string[],
    currentSuggestion: number,
    selectedYear: string,
    suggestionList: ISuggestion[],
    sourcePlf: IPlf,
    targetPlf: IPlf,
    votes: IVotes,
}

export interface ISuggestion {
    source_id: number,
    target_id: number,
    distance: number,
    nearestNeighbors: any,
}

export interface IPlf {
    [id: number]: string[],
}

export interface IVotes {
    [source_id: number]: {
        [target_id: number]: {
            distance: number,
            upvotes: number,
            downvotes: number,
        }
    }
}
