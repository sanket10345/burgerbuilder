import React, { Component } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import CheckoutSummary from '../../components/Order/CheckoutSummary/CheckoutSummary';
import ContactData from './ContactData/ContactData'
import * as actions from '../../store/actions';

class Checkout extends Component{
    state={
        ingredients:null,
        totalPrice:0    
    }

    checkoutCancelledHandler=()=>{
        this.props.history.goBack();
    }
    checkoutContinuedHandler=()=>{
       this.props.history.replace('/checkout/contact-data');    
    }

    render(){
        console.log(this.props.purchased);
        let summary = <Redirect to="/" />;
        
        if(this.props.ings){
            let purchasedRedirect = this.props.purchased ? <Redirect to="/" /> : null
            summary = (
                <div>
                {purchasedRedirect}    
                <CheckoutSummary 
                    ingredients={this.props.ings} 
                    checkoutCancelled={this.checkoutCancelledHandler}
                    checkoutContinued={this.checkoutContinuedHandler}     
                    
                />
                
                 < Route path={this.props.match.path + '/contact-data'} 
                  component={ContactData} /> 
                />
                </div>   
            );
        }
        return summary;
    }
}
const mapStateToProps = state =>{
    return {
        ings: state.burgerBuilder.ingredients,
        purchased: state.order.purchased
    }
}

export default connect(mapStateToProps)(Checkout);