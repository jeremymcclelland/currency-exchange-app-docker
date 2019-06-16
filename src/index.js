import React, { Component } from 'react';
import { render } from 'react-dom';

import NumberFormat from 'react-number-format';



import './index.scss';



//list to map exchange rate to
const currList = {
    "USD":{"code":"USD", "name":"United State Dollar"},
    "CAD":{"code":"CAD", "name":"Canadian Dollar"},
    "IDR":{"code":"IDR", "name":"Indonesian Rupiah"},
    "GBP":{"code":"GBP", "name":"Pound Sterling"},
    "CHF":{"code":"CHF", "name":"Swiss Franc"},
    "SGD":{"code":"SGD", "name":"Singapore Dollar"},
    "INR":{"code":"INR", "name":"Indian Rupee"},
    "MYR":{"code":"MYR", "name":"Malaysian Ringgit"},
    "JPY":{"code":"JPY", "name":"Japan Yen"},
    "KRW":{"code":"KRW", "name":"South Korean Won"}
  }


//creates array of keys from currList
const currCodes = Object.keys(currList);
console.log(currCodes);

const dropdownCodes = currCodes;

//removes usd from dropdown list
let usd = dropdownCodes.indexOf("USD");
console.log(usd)
if (usd !== -1) {
    dropdownCodes.splice(usd, 1);
}




//currency Calculator

class CurrencyExchange extends Component {

    constructor(props) {

        super(props);

        this.state = {
            base: 'USD',
            basenum: 1,
            selected: ['CAD', 'IDR', 'GBP', 'SGD'],
            rates: {},
            show: false,
            choose: '',
            test: {}
        };
        this.deleteList = this.deleteList.bind(this);
        this.handleToggleClick = this.handleToggleClick.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleNew = this.handleNew.bind(this);
    }

    //set choose state
    handleChange(e) {
        this.setState({choose: e.target.value});    
    }

    inputChangedHandler = values => {
        this.setState({ basenum: values.value });
        console.log('basenum', this.state.basenum);
    }

    deleteList(e) {
        var array = this.state.selected; 
        var index = array.indexOf(e.target.value);
        
        if (index !== -1) {
            array.splice(index, 1);
            this.setState({selected: array});
            this.setState({choose: false});
            
        }

        var dropDown = document.getElementById("code-select");
        if(dropDown) {
            dropDown.selectedIndex = -1;
        }
        
        
        
        
    }



    handleToggleClick() {
        this.setState(prevState => ({
          show: !prevState.show
        }));
        this.setState({choose: false});
      }

    //sets up array of selected currencies to compare to in chooseList
    handleNew(e) {
        e.preventDefault();

        var array = this.state.selected;
        array.push(e.target.value);
  

        array = array.filter(Boolean)
        console.log(array)

        

        this.setState({selected: array});
        this.setState({choose: false}); 
        var dropDown = document.getElementById("code-select");
        dropDown.selectedIndex = 0;
    }



    componentDidMount(){
   


        fetch('https://api.exchangeratesapi.io/latest?base=USD')
        .then(data => data.json())

        .then(data => {
            this.setState({ rates: data.rates });

            console.log('rates', this.state.rates);
        })

        .catch(function (error) {
            console.log(error);
        })
        

        

    }

    render() {

        const base = this.state.base;
        const basenum = parseFloat(this.state.basenum).toFixed(2);
        const rates = this.state.rates;
        const selected = this.state.selected;
        const show = this.state.show;
        //splits diference between dropdown codes and current selected list to add to select dropdown
        const chooseList = dropdownCodes.filter(function(obj) { return selected.indexOf(obj) === -1; });
        console.log('test' + chooseList)
        const choose =(this.state.choose ? this.state.choose : chooseList[0]);
        console.log(choose)

        const addForm = 
        <div id="code-select-wrapper">
        <select id="code-select" onChange={this.handleChange}>
            {chooseList.map(function(code, i){
                return <option value={code} key={code}>{code}</option>
            })}
        </select>
        <button onClick={this.handleNew} value={choose} >submit</button>               
        </div>;    

        return (
            <div id="app-wrapper">
            
            <div id="app-header">
            <em>{currList.USD.code} - {currList.USD.name}</em>
                <div className="app-header-flex">
                    <span>{currList.USD.code}</span>
                    <NumberFormat thousandSeparator={true} prefix={''} fixedDecimalScale={true} decimalSeparator={'.'} decimalScale={2} value={basenum} onValueChange={this.inputChangedHandler} />
                </div>
            </div>
            
            
            

            
            <ul id="currencyList">
            {selected.map(function(code){
                let tcode = code;
                let trate = parseFloat(rates[code]).toFixed(2);
                let tratetot = parseFloat(basenum * trate).toFixed(2);

                return(
                  <li key={code}>
                      <div className="flex-info">
                        <div className="code">{tcode}</div>
                        <NumberFormat value={tratetot} thousandSeparator={','} displayType={'text'}  prefix={''} fixedDecimalScale={true} decimalSeparator={'.'} decimalScale={2} />

                        
                       <div className="code-def">{currList[tcode].code} - {currList[tcode].name}</div>

                       <div className="exchange-rate">{'1'} {base} = {tcode} <NumberFormat value={trate} thousandSeparator={','} displayType={'text'}  prefix={''} fixedDecimalScale={true} decimalSeparator={'.'} decimalScale={2} /></div>

                    </div>
                       
                    <div className="flex-button">
                        <button onClick={this.deleteList} value={code}>-</button>
                    </div>
                    
                  </li>
                )
              }, this)} 
              </ul>


                <div className="add-wrapper">

                {show ? addForm : null}
                
                    <button className="addToggle" onClick={this.handleToggleClick}>
                    {show ? '(x) Cancel' : '(+) Add More Currencies'}        
                    </button>
              </div>


            </div>


            
        ) //ends return
    }
}


render(
    <CurrencyExchange />, 
    document.getElementById('root')
);