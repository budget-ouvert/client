export interface appState {
    dispatch?: any;
    data: any;
    selectedPath: any;
}

export interface action {
    type: string;
    promise?: (dispatch: any, getState: any) => any;
    value?: any;
    container?: string;
}
