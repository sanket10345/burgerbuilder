import React, { Component } from 'react';

import Aux from '../../hoc/Aux/Aux';
import { connect } from 'react-redux';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import Spinner from '../../components/UI/Spinner/Spinner'
import axios from '../../axios-orders'

import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';

import * as burgerBuilderActions from '../../store/actions';

const INGREDIENT_PRICES = {
    salad: 0.5,
    cheese: 0.4,
    meat: 1.3,
    bacon: 0.7
};

class BurgerBuilder extends Component {

    state = {
        purchasing: false,
    }

    updatePurchaseState (ingredients) {
        const sum = Object.keys( ingredients )
            .map( igKey => {
                return ingredients[igKey];
            } )
            .reduce( ( sum, el ) => {
                return sum + el;
            }, 0 );
        return sum > 0;    
    }

    purchaseHandler = () => {
        if(this.props.isAuthenticated){
            this.setState({purchasing: true});
        }
        else{
            this.props.onSetAuthRedirectPath('/checkout');
            this.props.history.push('/auth');
        }
    }

    purchaseCancelHandler = () => {
        this.setState({purchasing: false});
    }

    purchaseContinueHandler = () => {
        this.props.onInitPurchase();
        this.props.history.push('/checkout');
    }
    componentDidMount(){
        this.props.onInitIngredients();   
    }
    render () {
        const disabledInfo = {
            ...this.props.ings
        };
        for ( let key in disabledInfo ) {
            disabledInfo[key] = disabledInfo[key] <= 0
        }
        let orderSummary = null;
        if(this.props.ings){
            orderSummary=<OrderSummary 
                              ingredients={this.props.ings}
                              price={this.props.price}
                              purchaseCancelled={this.purchaseCancelHandler}
                              purchaseContinued={this.purchaseContinueHandler} />;
        }                       

        let burger = this.props.error ?  <p>Ingredients can't be loadede</p> : <Spinner />;
        if(this.props.ings){
            burger=(
                <Aux>
                <Burger ingredients={this.props.ings} />
                <BuildControls
                    ingredientAdded={this.props.onIngredientAdded}
                    ingredientRemoved={this.props.onIngredientRemoved}
                    disabled={disabledInfo}
                    purchasable={this.updatePurchaseState(this.props.ings)}
                    ordered={this.purchaseHandler}
                    price={this.props.price} 
                    isAuth={this.props.isAuthenticated} />
                    </Aux>);
        }
        
        // {salad: true, meat: false, ...}
        return (
            <Aux>
                <Modal show={this.state.purchasing} modalClosed={this.purchaseCancelHandler}>
                 {orderSummary}     
                </Modal>
                {burger}
            </Aux>
        );
    }
}

const mapStateToProps = state =>{
    return {
        ings: state.burgerBuilder.ingredients,
        price: state.burgerBuilder.totalPrice,
        error: state.burgerBuilder.error,
        isAuthenticated: state.auth.token !== null
    }
}

const mapDispatchToProps = dispatch =>{
    return{
        onIngredientAdded: ( ingName ) =>dispatch(burgerBuilderActions.addIndegredient(ingName)),
        onIngredientRemoved: ( ingName ) =>dispatch(burgerBuilderActions.removeIndegredient(ingName)),
        onInitIngredients : () => dispatch(burgerBuilderActions.initIngredients()),
        onInitPurchase: () => dispatch(burgerBuilderActions.purchaseInit()),
        onSetAuthRedirectPath: (path) => dispatch(burgerBuilderActions.setAuthRedirectPath(path)),
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(BurgerBuilder, axios));