import React, {Component} from 'react';
import {Meteor} from 'meteor/meteor';
import {withTracker} from 'meteor/react-meteor-data';
import {Products} from '../api/products';
import {Items} from '../api/items';
import {Card, CardContent, List, ListItem, ListItemText, Typography} from "@material-ui/core";
import {Link} from "react-router-dom";
import ShoppinglistItem from "./ShoppinglistItem";
import {Packagings} from "../api/packagings";

class ShoppingList extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Card>
                <CardContent>
                    <Typography variant={'h6'}>
                        Boodschappen
                    </Typography>
                    <List>
                        {this.props.products.filter(product => product.packagings().filter(packaging => packaging.toRetrieve() > 0).length > 0).map(product => (
                            <React.Fragment key={product._id}>
                                <ListItem>
                                    <ListItemText><strong>{product.name}</strong></ListItemText>
                                </ListItem>
                                {product.packagings().filter(packaging => packaging.toRetrieve() > 0).map(packaging => (
                                    <ShoppinglistItem key={packaging._id} packaging={packaging}/>
                                ))}
                            </React.Fragment>
                        ))}
                    </List>

                    <Typography variant={'h6'}>
                        Al gehaald
                    </Typography>
                    <List>
                        {this.props.products.filter(product => product.packagings().filter(packaging => packaging.retrieved() > 0).length > 0).map(product => (
                            <React.Fragment key={product._id}>
                                <ListItem>
                                    <ListItemText><strong>{product.name}</strong></ListItemText>
                                </ListItem>
                                {product.packagings().filter(packaging => packaging.retrieved() > 0).map(packaging => (
                                    <ShoppinglistItem key={packaging._id} packaging={packaging} retrieved/>
                                ))}
                            </React.Fragment>
                        ))}
                    </List>
                </CardContent>
            </Card>
        );
    }

}

export default withTracker(() => {
    Meteor.subscribe('items');
    Meteor.subscribe('products');
    Meteor.subscribe('packagings');
    return {
        products: Products.find({}).fetch(),
        packagings: Packagings.find({}).fetch(),
        items: Items.find({}).fetch(),
    };
})(ShoppingList);