import React, {Component} from 'react';
import {Meteor} from 'meteor/meteor';
import {withTracker} from 'meteor/react-meteor-data';
import {Products} from '../api/products';
import {Users} from '../api/users';
import {Items} from '../api/items';
import {Button, Card, CardContent, List, ListItem, ListItemText, Typography} from "@material-ui/core";
import {Link} from "react-router-dom";
import PaymentListItem from './PaymentListItem';
import PaymentUserItem from './PaymentUserItem';
import {Packagings} from "../api/packagings";
import ShoppinglistItem from "./ShoppinglistItem";

class ShoppingList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            price: {},
        };

        this.handlePayed = this.handlePayed.bind(this);
    }

    componentDidMount() {
        this.props.products.forEach(packaging => {
            this.setState({
                price: {
                    ...this.state.price,
                    [packaging._id]: '',
                },
            });
        });
    }

    calculatePrice(user) {
        let sum = 0;
        user.retrieved().forEach(retrieved => {
            this.props.packagings.forEach(packaging => {
                if (retrieved.packagingId === packaging._id) {
                    sum += (parseFloat(this.state.price[packaging._id]) || 0) / packaging.retrieved() * retrieved.amount;
                }
            })
        });
        return (Math.round(sum * 100) / 100).toFixed(2);
    }

    handlePayed() {
        this.props.packagings.filter(packaging => packaging.retrieved() > 0).forEach(packaging => {
            Meteor.call('packagings.setPayed', {packaging: packaging});
        });
    }


    render() {
        return (
            <React.Fragment>
                <Card>
                    <CardContent>
                        <Typography variant={'h6'}>
                            Producten
                        </Typography>
                        <List>
                            {this.props.products.filter(product => product.packagings().filter(packaging => packaging.retrieved() > 0).length > 0).map(product => (
                                <React.Fragment key={product._id}>
                                    <ListItem>
                                        <ListItemText><strong>{product.name}</strong></ListItemText>
                                    </ListItem>
                                    {product.packagings().filter(packaging => packaging.retrieved() > 0).map(packaging => (
                                        <PaymentListItem key={packaging._id} packaging={packaging}
                                                         value={this.state.price[packaging._id]}
                                                         onChange={event => this.setState({
                                                             price: {
                                                                 ...this.state.price,
                                                                 [packaging._id]: event.target.value
                                                             }
                                                         })}/>
                                    ))}
                                </React.Fragment>
                            ))}
                        </List>
                    </CardContent>
                </Card>
                <br/>
                <Card>
                    <CardContent>
                        <Typography variant={'h6'}>
                            Personen
                        </Typography>
                        <List>
                            {this.props.users.map(user => (
                                <PaymentUserItem key={user._id} user={user} amount={this.calculatePrice(user)}/>
                            ))}
                        </List>
                        <Button variant={'contained'} color={'primary'} onClick={this.handlePayed}>Afgehandeld!</Button>
                    </CardContent>
                </Card>
            </React.Fragment>
        );
    }

}

export default withTracker(() => {
    Meteor.subscribe('items');
    Meteor.subscribe('users');
    Meteor.subscribe('packagings');
    Meteor.subscribe('products');
    return {
        products: Products.find({}).fetch(),
        packagings: Packagings.find({}).fetch(),
        users: Users.find({}).fetch(),
        items: Items.find({}).fetch(),
    };
})(ShoppingList);