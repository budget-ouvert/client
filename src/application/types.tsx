export interface appState {
    dispatch?: any;
    data: any;
    dataLoadedTime: number;
    selectedPath: any;
}

export interface action {
    type: string;
    promise?: (dispatch: any, getState: any) => any;
    value?: any;
}
