import * as redux from 'redux'

// Redux types
export interface ISimpleAction {
    type: string,
    payload?: any,
}

export type IThunkAction = (dispatch: redux.Dispatch<any>, getState: any) => void

export type IAction = ISimpleAction | IThunkAction

// This is the structure of the only store of this application.
// The canonical state (data fetched from APIs) is stored under `data`
// whereas the view state is stored under `view.[name_of_the_view]`
export interface IReduxStore {
    dispatch?: any,
    data: any,
    views: any,
}

// VIEWS
export interface IView {
    dispatch?: any,
    data: any,
}

// Verification view
export interface IVerificationViewState {
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

export interface IVerificationView extends IView, IVerificationViewState {}

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
