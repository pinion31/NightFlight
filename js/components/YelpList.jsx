import React, {Component} from 'react';
import {Col, Button, FormGroup, FormControl, Form, Modal, Image, Alert, Media} from 'react-bootstrap';
import 'whatwg-fetch';

class YelpList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      barList: [],
      query: '',
      attendeeList: {list: []},
      showModal: false,
    };

    this.retrieveSearchData = this.retrieveSearchData.bind(this);
    this.setQuery = this.setQuery.bind(this);
    this.addSelf = this.addSelf.bind(this);
    this.toggleGoingModal = this.toggleGoingModal.bind(this);
  }

  setQuery(e) {
    this.setState({
      query: e.target.value,
    });
  }

  retrieveSearchData(e) {
    e.preventDefault();

    fetch('/list', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({query: this.state.query, name: 'this user'}),
    }).then((res) => {
      res.json().then((result) => {
        this.setState({
          barList: JSON.parse(result),
        });
      });
    });
  }

  toggleGoingModal(e) {
    if (!this.state.showModal) {
      fetch('/getAttendees', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({id: e.target.name}),
      }).then((res) => {
        res.json().then((result) => {
          this.setState({
            showModal: true,
            attendeeList: result,
          });
        });
      });
    } else {
      this.setState({
        showModal: false,
      });
    }
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
        <FormGroup className= "search-field">
          <FormControl
            name="query"
            type="text"
            placeholder="City, State"
            onChange={this.setQuery}
            maxLength='47'
          />
          <Button bsStyle= 'info' className= 'search-button' onClick={this.retrieveSearchData}>Search</Button>
        </FormGroup>
      </Form>
      </Col>
    {this.state.barList.map((result,key) => {
        let titleFontSize = result.name.length > 20?2.5:3;
        let addressBar = result.address.length === 0?'No Street Address Available':result.address;

        return (
          <div key={key}>
            <Col md={8} mdOffset={2} sm={8} smOffset={2} xs={8} xsOffset={2} lg={8} lgOffset={2}>
              <Media  className='card'>
                <Media.Left align='top'>
                  <Image src={result.image_url} alt={result.name} style={{width:'200px', height:'150px'}} />
                </Media.Left>
                <Media.Body>
                  <p className='card-title' style={{fontSize:`${titleFontSize.toString()}em`}}>{result.name}</p>
                  <Button className='RSVP' bsStyle='danger' name={result.id} onClick={this.addSelf}>{result.RSVPmessage}</Button>
                  <div className='address'>
                  <p>{addressBar}</p>
                  <p>{`${result.city}, ${result.state} ${result.zipcode}`}</p>
                  </div>
                  <div className='cardBottom'>
                  <p className='going-message'>{result.goingMessage}</p>
                  <p className='rating-message'>{`Rating: ${result.stars}`}</p>
                  <Button name={result.id} className='goingButton' bsStyle='danger' onClick={this.toggleGoingModal}>{"See Who's Going"}</Button>
                  </div>
                </Media.Body>
              </Media>
            </Col>
          </div>
        );
     })
    }
        <Modal
          show={this.state.showModal}
          bsSize="small"
          aria-labelledby="contained-modal-title-sm"
          onHide={this.toggleGoingModal}
        >
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-sm">Club Attendees</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {this.state.attendeeList.list.map((attendee, key) =>
              <b key={key}>{` ${attendee},`}</b>
            )
            }
          </Modal.Body>
          <Modal.Footer>
            <Button className="goingButton" onClick={this.toggleGoingModal}>Close</Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

YelpList.propTypes = {
  resultList: React.PropTypes.array,
  query: React.PropTypes.string,
  attendeeList: React.PropTypes.object,
  showModal: React.PropTypes.bool,
};

export default YelpList
