import * as React from 'react'
import {Button, MenuItem, Intent} from "@blueprintjs/core";
import {Select, ItemPredicate, ItemRenderer} from "@blueprintjs/select";
import {IconName} from '@blueprintjs/icons';

interface ISelectProps<T> {
    disabled?: boolean,
    displayItem: (item: any) => string,
    filterItems: ItemPredicate<T>,
    icon?: IconName,
    inputItem: T,
    intent?: Intent,
    items: T[],
    onChange?: any,
    renderItem: ItemRenderer<T>,
};

export default class TSelect<T> extends React.Component<ISelectProps<T>, any> {
    constructor(props: ISelectProps<T>) {
        super(props);
    }

    private CustomSelect = Select.ofType<T>();

    private handleValueChange = (item: T) => {
        this.props.onChange(item)
    }

    public render () {
        const {
            disabled,
            items,
            inputItem,
            intent,
        } = this.props

        return (
            <div>
                <this.CustomSelect
                    items={items}
                    itemPredicate={this.props.filterItems}
                    itemRenderer={this.props.renderItem}
                    noResults={<MenuItem disabled={true} text="No results." />}
                    onItemSelect={this.handleValueChange}
                >
                    <Button
                        disabled={disabled}
                        icon={this.props.icon}
                        rightIcon="caret-down"
                        text={this.props.displayItem(inputItem)}
                        intent={intent ? intent : null}
                    />
                </this.CustomSelect>
            </div>
        )
    }
}
