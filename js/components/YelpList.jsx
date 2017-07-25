import React, {Component} from 'react';
//import {Yelp as yelp} from 'yelp-fusion';
//const yelp = require('yelp-fusion');
import {Row, Col, Button, FormGroup, FormControl, Alert} from 'react-bootstrap';
import 'whatwg-fetch';

class YelpList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      barList:[],
      query:"",
    };

    this.retrieveSearchData = this.retrieveSearchData.bind(this);
    this.setQuery = this.setQuery.bind(this);
    this.addSelf = this.addSelf.bind(this);
  }

  componentDidMount() {
    //this.retrieveSearchData();
  }

  retrieveSearchData() {
    fetch('/list', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({query:this.state.query, name:'this user'}),
    }).then (res => {
        res.json().then(result => {
            this.setState({
              barList: JSON.parse(result),
            });

        });

    });
  }

  setQuery(e) {
    this.setState({
      query:e.target.value,
    });

  }

  addSelf(e) {
    fetch('/addSelf', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({username:'this user', id:e.target.name}),
    }).then (res => {
        res.json().then(result => {
            this.setState({
              barList: JSON.parse(result),
            });
        });
    });
  }

  render() {
    return (
    <div>
    <Row>
      <Col md={6} mdOffset={3} sm={6} smOffset={3} xs={6} xsOffset={3} lg={6} lgOffset={3}>
        <FormGroup>
          <FormControl
            name='query'
            type='text'
            placeholder='city,state'
            onChange={this.setQuery}
            maxLength='47'
          />
        </FormGroup>
      </Col>
    </Row>
    <Row>
      <Col md={6} mdOffset={3} sm={6} smOffset={3} xs={6} xsOffset={3} lg={6} lgOffset={3}>
        <Button bsStyle='primary' onClick={this.retrieveSearchData}>Submit</Button>
      </Col>
    </Row>
    <Row>
    {this.state.barList.map((result,key) => {
        return (
          <div key={key}>
            <img src={result.image_url} alt={result.name} style={{width:'304px', height:'228px'}}/>
            <p>{result.name}</p>
            <p>{result.goingMessage}</p>
            <Button name={result.id} bsStyle='primary' onClick={this.addSelf}>{`RSVP`}</Button>
          </div>
        );

     })
    }
    </Row>
    </div>
    );
  }

}

//<p>{`${result.occupants? result.occupants.length:'0'} GOING`}</p>
YelpList.propTypes =  {
  resultList:React.PropTypes.array,
  query:React.PropTypes.string
};

export default YelpList
