import { Mongo } from 'meteor/mongo';

import {Packagings} from "./packagings";

export const Items = new Mongo.Collection('items');

if (Meteor.isServer) {
    Meteor.publish('items', function itemsPublication() {
        return Items.find({});
    });
}

Items.helpers({
    packaging() {
        return Packagings.findOne({_id: this.packagingId});
    }
});

Meteor.methods({
    'items.insert'({ item }) {
        const existingItem = Items.findOne({
            productId: item.productId,
            userId: item.userId,
            retrieved: false,
            payed: false,
        });

        if (existingItem) {
            Items.update(existingItem, {
                ...existingItem,
                amount: existingItem.amount+item.amount,
            });
        } else {
            Items.insert({
                ...item,
                retrieved: false,
                payed: false,
            });
        }
    }
});