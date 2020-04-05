import React, {Component} from 'react';
import {withStyles} from '@material-ui/core';
import {ListItem, ListItemText, ListItemSecondaryAction, ListItemIcon, IconButton, Checkbox} from "@material-ui/core";
import DeleteIcon from '@material-ui/icons/Delete';

const style = theme => ({
    strikethrough: {
        textDecoration: 'line-through',
    },
});

class ShoppinglistItem extends Component {
    constructor(props) {
        super(props);

        this.handleRetrieved = this.handleRetrieved.bind(this);
    }

    handleRetrieved() {
        Meteor.call('packagings.retrieve', {packaging: this.props.packaging, retrieved: !this.props.retrieved});
    }

    render() {
        const {packaging, classes} = this.props;
        return (
            <ListItem>
                <ListItemIcon>
                    <Checkbox
                        edge={'start'}
                        checked={this.props.retrieved}
                        tabIndex={-1}
                        disableRipple
                        onChange={this.handleRetrieved}
                    />
                </ListItemIcon>
                <ListItemText className={this.props.retrieved ? classes.strikethrough : ''} primary={`${this.props.retrieved ? packaging.retrieved() : packaging.toRetrieve()} x ${packaging.name} ${packaging.product().name}`}/>
            </ListItem>
        );
    }
}

export default withStyles(style)(ShoppinglistItem)