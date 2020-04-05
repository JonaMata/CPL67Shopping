import { Mongo } from 'meteor/mongo';
import {Items} from "./items";
import {Products} from "./products";

export const Packagings = new Mongo.Collection('packagings');

if (Meteor.isServer) {
    Meteor.publish('packagings', function packagingsPublication() {
        return Packagings.find({});
    });
}

Packagings.helpers({
    product() {
        return Products.findOne({_id: this.productId});
    },
    toRetrieve() {
        let sum = 0;
        Items.find({packagingId: this._id, retrieved: false}).fetch().forEach(item => {
            sum+=parseFloat(item.amount);
        });
        return sum;
    },
    retrieved() {
        let sum = 0;
        Items.find({packagingId: this._id, retrieved: true, payed: false}).fetch().forEach(item => {
            sum+=parseFloat(item.amount);
        });
        return sum;
    }
});

Meteor.methods({
    'packagings.retrieve'({packaging, retrieved}) {
        Items.find({
            packagingId: packaging._id,
            retrieved: !retrieved,
            payed: false,
        }).fetch().forEach(item => {
            const existing = Items.findOne({
                userId: item.userId,
                packagingId: item.packagingId,
                retrieved: retrieved,
                payed: false,
            });
            let newAmount = item.amount;
            if (existing) {
                newAmount+=existing.amount;
                Items.remove(item);
                item=existing;
            }
            Items.update(item, {
                $set: {
                    amount: newAmount,
                    retrieved: retrieved,
                },
            });
        });
    }
});