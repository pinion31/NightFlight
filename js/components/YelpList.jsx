import React, {Component} from 'react';
//import {Yelp as yelp} from 'yelp-fusion';
//const yelp = require('yelp-fusion');
import {Row, Col, Button, FormGroup, FormControl, Form, Image, Alert, Media} from 'react-bootstrap';
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

  retrieveSearchData(e) {
    e.preventDefault();

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
      <Col md={8} mdOffset={2} sm={8} smOffset={2} xs={8} xsOffset={2} lg={8} lgOffset={2}>
      <Form inline>
        <FormGroup className='search-field'>
          <FormControl
            name='query'
            type='text'
            placeholder='city,state'
            onChange={this.setQuery}
            maxLength='47'
          />
          <Button bsStyle='info' className='search-button' onClick={this.retrieveSearchData}>Search</Button>
        </FormGroup>
      </Form>
      </Col>
    {this.state.barList.map((result,key) => {
        return (
          <div key={key}>
            <Col md={8} mdOffset={2} sm={8} smOffset={2} xs={8} xsOffset={2} lg={8} lgOffset={2}>
              <Media  className='card'>
                <Media.Left align='top'>
                  <Image src={result.image_url} alt={result.name} style={{width:'200px', height:'150px'}} />
                </Media.Left>
                <Media.Body>
                  <p className='card-title'>{result.name}</p>
                  <div className='address'>
                  <p>{result.address}</p>
                  <p>{`${result.city}, ${result.state} ${result.zipcode}`}</p>
                  </div>
                  <p className='going-message'>{result.goingMessage}</p>
                  <Button className='RSVP'name={result.id} bsStyle='danger' onClick={this.addSelf}>{result.RSVPmessage}</Button>
                </Media.Body>
              </Media>
            </Col>
          </div>
        );

     })
    }
    </div>
    );
  }
  /*
  render() {
    return (
    <div>
    <Row>
      <Col md={8} mdOffset={2} sm={8} smOffset={2} xs={8} xsOffset={2} lg={8} lgOffset={2}>
        <FormGroup>
          <FormControl
            name='query'
            type='text'
            placeholder='city,state'
            onChange={this.setQuery}
            maxLength='47'
          />
          <Button bsStyle='primary' onClick={this.retrieveSearchData}>Submit</Button>
        </FormGroup>
      </Col>
    </Row>
    <Row>
    {this.state.barList.map((result,key) => {
        return (
         <div key={key}>
            <img src={result.image_url} alt={result.name} style={{width:'200px', height:'150px'}}/>
            <p>{result.name}</p>
            <p>{result.goingMessage}</p>
            <Button name={result.id} bsStyle='primary' onClick={this.addSelf}>{result.RSVPmessage}</Button>
          </div>
        );

     })
    }
    </Row>
    </div>
    );
  }*/

}

//<p>{`${result.occupants? result.occupants.length:'0'} GOING`}</p>
YelpList.propTypes =  {
  resultList:React.PropTypes.array,
  query:React.PropTypes.string
};

export default YelpList
