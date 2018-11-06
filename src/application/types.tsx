export interface IAppState {
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
