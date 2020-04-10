import { Mongo } from 'meteor/mongo';
import {Items} from "./items";

export const Users = new Mongo.Collection('users');

if (Meteor.isServer) {
    Meteor.publish('users', function usersPublication() {
        return Users.find({}, {sort: {name: 1}});
    });
}

Users.helpers({
    retrieved() {
        return Items.find({userId: this._id, retrieved: true, payed: false}).fetch();
    },
});
