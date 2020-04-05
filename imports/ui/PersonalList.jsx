import React, {Component} from 'react';
import {withTracker} from 'meteor/react-meteor-data';
import {Items} from '../api/items';
import {Users} from '../api/users';
import {Products} from '../api/products';
import {withRouter, Link} from 'react-router-dom';
import {
    Typography,
    Card,
    CardContent,
    List,
    TextField,
    FormControl,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions
} from "@material-ui/core";
import Autocomplete, {createFilterOptions} from '@material-ui/lab/Autocomplete';
import {withStyles} from '@material-ui/core/styles';
import PersonallistItem from "./PersonallistItem";
import {Packagings} from "../api/packagings";

const filter = createFilterOptions();

const style = theme => ({
    marginTop: {
        marginTop: theme.spacing(1),
    },
});

class PersonalList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            product: null,
            packaging: null,
            amount: '',
            open: false,
            dialogValue: {
                type: '',
                name: '',
            }
        };

        this.productField = React.createRef();

        this.handleAddOption = this.handleAddOption.bind(this);
        this.handleDialogClose = this.handleDialogClose.bind(this);
        this.handleAdditem = this.handleAdditem.bind(this);
    }

    handleAddOption(event) {
        event.preventDefault();
        switch(this.state.dialogValue.type) {
            case 'product':
                Products.insert({
                    name: this.state.dialogValue.name,
                }, (error, result) => {
                    this.setState({
                        product: Products.findOne({_id: result}),
                    });
                });
                break;
            case 'packaging':
                Packagings.insert({
                    name: this.state.dialogValue.name,
                    productId: this.state.product._id,
                }, (error, result) => {
                    this.setState({
                        packaging: Packagings.findOne({_id: result}),
                    });
                });
                break;
        }

        this.handleDialogClose();
    }

    handleDialogClose() {
        this.setState({
            dialogValue: {
                type: '',
                name: '',
            },
            open: false,
        });
    }

    handleAdditem(event) {
        event.preventDefault();

        Meteor.call('items.insert', {
            item: {
                packagingId: this.state.packaging._id,
                userId: this.props.user._id,
                amount: parseFloat(this.state.amount),
            }});

        this.setState({
            product: null,
            packaging: null,
            amount: '',
        });
    }

    render() {
        const {classes} = this.props;

        return (
            <Card>
                <CardContent>
                    <Typography variant={'h6'}>{this.props.user ? this.props.user.name : this.props.match.params.name}s
                        Lijst</Typography>
                    <form onSubmit={this.handleAdditem}>
                        {/*
                        Product input
                        */}
                        <Autocomplete

                            id={'product'}
                            openOnFocus
                            autoHighlight
                            autoSelect
                            value={this.state.product}
                            options={this.props.products}
                            getOptionLabel={(option) => {
                                if (typeof option === 'string') {
                                    return option;
                                }
                                if (option.inputValue) {
                                    return option.name;
                                }
                                return option.name;
                            }}
                            onChange={(event, newValue) => {
                                if (typeof newValue === 'string') {
                                    setTimeout(() => {
                                        this.setState({
                                            open: true,
                                            dialogValue: {
                                                type: 'product',
                                                name: newValue,
                                            },
                                        });
                                    });
                                    return;
                                }

                                if (newValue && newValue.inputValue) {
                                    this.setState({
                                        open: true,
                                        dialogValue: {
                                            type: 'product',
                                            name: newValue.inputValue,
                                        },
                                    });
                                    return;
                                }

                                this.setState({
                                    product: newValue,
                                });
                            }}
                            filterOptions={(options, params) => {
                                const filtered = filter(options, params);

                                if (params.inputValue !== '') {
                                    filtered.push({
                                        inputValue: params.inputValue,
                                        name: `Add "${params.inputValue}"`,
                                    });
                                }

                                return filtered;
                            }}
                            renderInput={(params) => <TextField {...params} label={'Product'}
                                                                variant={'standard'}/>}
                        />
                        {/*
                        Packaging input
                        */}
                        <Autocomplete

                            id={'packaging'}
                            disabled={!this.state.product}
                            openOnFocus
                            autoHighlight
                            autoSelect
                            value={this.state.packaging}
                            options={this.props.packagings.filter(packaging => packaging.productId === (this.state.product ? this.state.product._id : null))}
                            getOptionLabel={(option) => {
                                if (typeof option === 'string') {
                                    return option;
                                }
                                if (option.inputValue) {
                                    return option.name;
                                }
                                return option.name;
                            }}
                            onChange={(event, newValue) => {
                                if (typeof newValue === 'string') {
                                    setTimeout(() => {
                                        this.setState({
                                            open: true,
                                            dialogValue: {
                                                type: 'packaging',
                                                name: newValue,
                                            },
                                        });
                                    });
                                    return;
                                }

                                if (newValue && newValue.inputValue) {
                                    this.setState({
                                        open: true,
                                        dialogValue: {
                                            type: 'packaging',
                                            name: newValue.inputValue,
                                        },
                                    });
                                    return;
                                }

                                this.setState({
                                    packaging: newValue,
                                });
                            }}
                            filterOptions={(options, params) => {
                                const filtered = filter(options, params);

                                if (params.inputValue !== '') {
                                    filtered.push({
                                        inputValue: params.inputValue,
                                        name: `Add "${params.inputValue}"`,
                                    });
                                }

                                return filtered;
                            }}
                            renderInput={(params) => <TextField {...params} label={'Verpakking'}
                                                                variant={'standard'}/>}
                        />
                        {/*
                        Amount input
                        */}
                        <FormControl fullWidth>
                            <TextField required value={this.state.amount} onChange={event => this.setState({amount: event.target.value})} id={'amount'} label={'Amount'} variant={'standard'} type={'number'}/>
                        </FormControl>
                        <Button className={classes.marginTop} type={'submit'} variant={'contained'} color={'primary'}>Toevoegen</Button>
                    </form>

                    {/*
                        Add option dialog
                        */}
                    <Dialog open={this.state.open}
                            onClose={this.handleClose}
                            aria-labelledby={'product-dialog'}
                    >
                        <form onSubmit={this.handleAddOption}>
                            <DialogTitle id={'option-dialog'}>Nieuw product toevoegen</DialogTitle>
                            <DialogContent>
                                <TextField
                                    autoFocus
                                    margin={'dense'}
                                    id={'newOption'}
                                    value={this.state.dialogValue.name}
                                    onChange={(event) => this.setState({
                                        dialogValue: {
                                            ...this.state.dialogValue,
                                            name: event.target.value,
                                        },
                                    })}
                                    label={this.state.dialogValue.type === 'product' ? 'Nieuw product' : 'Nieuwe verpakking'}
                                    type={'text'}
                                />
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={this.handleDialogClose} color={'primary'}>
                                    Annuleren
                                </Button>
                                <Button type={'submit'} color={'primary'}>
                                    Toevoegen
                                </Button>
                            </DialogActions>
                        </form>
                    </Dialog>
                    <List>
                        {this.props.items.map(item => (
                            <PersonallistItem item={item} key={item._id}/>
                        ))}
                    </List>
                </CardContent>
            </Card>
        );
    }

}

export default withStyles(style)(withRouter(withTracker(({match}) => {
    Meteor.subscribe('users');
    Meteor.subscribe('items');
    Meteor.subscribe('packagings');
    Meteor.subscribe('products');
    const user = Users.findOne({name: match.params.user});
    return {
        user: user,
        items: user ? Items.find({userId: user._id, payed: false}).fetch() : [],
        packagings: Packagings.find({}).fetch(),
        products: Products.find({}).fetch(),
    };
})(PersonalList)))