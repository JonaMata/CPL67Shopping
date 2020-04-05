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

    calculateCosts() {

    }

    render() {
        const {user, amount} = this.props;
        return (
            <ListItem>
                <ListItemText primary={`${user.name} €${amount}`}/>
            </ListItem>
        );
    }
}

export default PaymentListItem