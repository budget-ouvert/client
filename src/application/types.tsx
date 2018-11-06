import * as redux from 'redux'

// Redux types
export interface simpleAction {
    type: string,
    payload?: any,
}

export type thunkAction = (dispatch: redux.Dispatch<any>, getState: any) => void

export type action = simpleAction | thunkAction

// VIEWS

// Main view
export interface IMainViewState {
    dispatch?: any,
    sunburst: ISunburstState
}

export interface ISunburstState {
    data: any,
    dataLoadedTime: number,
    selectedPath: any,
}

export interface action {
    type: string,
    payload?: any,
}
