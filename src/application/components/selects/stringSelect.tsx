import * as React from 'react'
import {Button, MenuItem, Intent} from "@blueprintjs/core";
import {Select, ItemPredicate, ItemRenderer} from "@blueprintjs/select";
import {IconName} from '@blueprintjs/icons';

import TSelect from './TSelect'

interface ISelectProps {
    disabled?: boolean,
    items: string[],
    inputItem: string,
    icon?: IconName,
    intent?: Intent,
    onChange: any,
}

export default class StringSelect extends React.Component<ISelectProps, any> {
    private renderItem: ItemRenderer<string> = (item, {handleClick, modifiers, query}) => {
        return (
            <MenuItem
                key={item}
                onClick={handleClick}
                text={item}
            />
        );
    };

    private filterByName: ItemPredicate<string> = (query, item) => {
        return `${item}`.indexOf(query.toLowerCase()) >= 0;
    };

    private displayItem = function(item: string): string {
        return (item ? item : "None");
    };

    public render () {
        const {
            disabled,
            items,
            inputItem,
            icon,
            intent,
            onChange,
        } = this.props

        return (
            <div>
                <TSelect<string>
                    disabled={disabled}
                    renderItem={this.renderItem}
                    filterItems={this.filterByName}
                    displayItem={this.displayItem}
                    inputItem={inputItem}
                    items={items}
                    icon={icon}
                    intent={intent}
                    onChange={onChange}
                />
            </div>
        )
    }
}
