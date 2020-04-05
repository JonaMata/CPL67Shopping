import React, {Component} from 'react';
import {withTracker} from 'meteor/react-meteor-data';
import {Users} from '../api/users';
import {Link} from 'react-router-dom';
import {Typography, Container, Card, CardContent, List, ListItem, ListItemText} from "@material-ui/core";

class PersonList extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Card>
                <CardContent>
                    <Typography variant={'h6'}>
                        Wie ben je?
                    </Typography>
                    <List>
                        {this.props.users.map(user => (
                            <ListItem button component={Link} to={'/user/' + user.name} key={user._id}>
                                <ListItemText primary={user.name}/>
                            </ListItem>
                        ))}
                    </List>
                </CardContent>
            </Card>
        );
    }

}

export default withTracker(() => {
    Meteor.subscribe('users');
    return {
        users: Users.find({}).fetch(),
    };
})(PersonList);