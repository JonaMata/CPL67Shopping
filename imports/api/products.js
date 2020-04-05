import { Mongo } from 'meteor/mongo';
import {Packagings} from "./packagings";

export const Products = new Mongo.Collection('products');

if (Meteor.isServer) {
    Meteor.publish('products', function productsPublication() {
        return Products.find({});
    });
}

Products.helpers({
    packagings() {
        return Packagings.find({productId: this._id}).fetch();
    },
});