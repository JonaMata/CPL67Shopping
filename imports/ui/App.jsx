import {Meteor} from 'meteor/meteor';
import React, {Component} from 'react';
import {BrowserRouter as Router, Switch, Route, Link} from 'react-router-dom';

import PersonList from './PersonList';
import ShoppingList from './ShoppingList';
import PersonalList from './PersonalList';

import {CssBaseline, AppBar, Toolbar, IconButton, Typography, Container, Grid} from "@material-ui/core";
import {createMuiTheme, ThemeProvider, withStyles} from '@material-ui/core/styles';
import {blue} from '@material-ui/core/colors';
import PersonIcon from '@material-ui/icons/Person';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import LocalAtmIcon from '@material-ui/icons/LocalAtm';
import PaymentList from "./PaymentList";

const theme = createMuiTheme({
    palette: {
        primary: {
            main: blue[500],
        },
    },
});


const styles = theme => ({
    content: {
        paddingTop: theme.spacing(4),
    }
});

class App extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const {classes} = this.props;
        return (
            <React.Fragment>
                <CssBaseline/>
                <Router>
                    <ThemeProvider theme={theme}>
                        <AppBar position={'sticky'}>
                            <Toolbar>
                                <Typography variant={'h6'} noWrap>
                                    CPL67 Boodschappen
                                </Typography>
                                <IconButton color={'inherit'} component={Link} to={'/'}>
                                    <PersonIcon/>
                                </IconButton>
                                <IconButton color={'inherit'} component={Link} to={'/shopping'}>
                                    <ShoppingCartIcon/>
                                </IconButton>
                                <IconButton color={'inherit'} component={Link} to={'/payment'}>
                                    <LocalAtmIcon/>
                                </IconButton>
                            </Toolbar>
                        </AppBar>
                        <Grid container className={classes.content} justify={'center'}>
                            <Grid item md={8} xs={12}>
                                <Container>
                                    <Switch>
                                        <Route exact path={'/'} component={PersonList}/>
                                        <Route exact path={'/shopping'} component={ShoppingList}/>
                                        <Route exact path={'/user/:user'} component={PersonalList}/>
                                        <Route exact path={'/payment'} component={PaymentList}/>
                                    </Switch>
                                </Container>
                            </Grid>
                        </Grid>
                    </ThemeProvider>
                </Router>
            </React.Fragment>
        );
    }

}

export default withStyles(styles)(App)