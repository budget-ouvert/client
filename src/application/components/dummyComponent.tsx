import * as React from 'react'

interface Props {
    child: any;
}

interface State {

}

export class DummyComponent extends React.Component<Props, State> {
    public render() {
        let {child} = this.props;

        return (
            <div>
                Currently selected node name: {child.data.name}
            </div>
        )
    }
}
