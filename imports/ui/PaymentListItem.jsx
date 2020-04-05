import React, {Component} from 'react';
import {
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
    ListItemIcon,
    IconButton,
    Checkbox,
    TextField
} from "@material-ui/core";

class PaymentListItem extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const {packaging} = this.props;
        return (
            <ListItem>
                <ListItemText primary={`${packaging.retrieved()} x ${packaging.name} ${packaging.product().name}`}/>
                <ListItemSecondaryAction>
                    <TextField edge={'end'} label={'Price'} type={'number'} value={this.props.value} onChange={this.props.onChange}/>
                </ListItemSecondaryAction>
            </ListItem>
        );
    }
}

export default PaymentListItem