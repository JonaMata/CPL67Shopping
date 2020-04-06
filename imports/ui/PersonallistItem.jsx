import React, { Component } from 'react';
import {withStyles} from '@material-ui/core';
import {ListItem, ListItemText, ListItemSecondaryAction, IconButton} from "@material-ui/core";
import DeleteIcon from '@material-ui/icons/Delete';

import {Items} from '../api/items';

const style = theme => ({
    strikethrough: {
        textDecoration: 'line-through',
    },
});


class PersonallistItem extends Component {
    constructor(props) {
        super(props);

        this.handleDelete = this.handleDelete.bind(this);
    }

    handleDelete() {
        Items.remove(this.props.item._id);
    }

    render() {
        const {item, classes} = this.props;
        return (
            <ListItem>
                <ListItemText className={item.retrieved ? classes.strikethrough : ''} primary={`${item.amount} x ${item.packaging() ? item.packaging().name : ''} ${item.packaging().product() ? item.packaging().product().name : ''}`}/>
                <ListItemSecondaryAction>
                    <IconButton disabled={item.retrieved} edge={'end'} aria-label={'delete'} onClick={this.handleDelete}>
                        <DeleteIcon/>
                    </IconButton>
                </ListItemSecondaryAction>
            </ListItem>
        );
    }
}

export default withStyles(style)(PersonallistItem)