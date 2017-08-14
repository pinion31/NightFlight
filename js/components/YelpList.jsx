import React, {Component} from 'react';
import {Col, Row,Button, FormGroup, FormControl, Form, Modal, Image, Media} from 'react-bootstrap';
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
      body: JSON.stringify({query: this.state.query, name: this.props.match.params.id}),
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
      body: JSON.stringify({username: this.props.match.params.id, id: e.target.name}),
    }).then((res) => {
      res.json().then((result) => {
        this.setState({
          barList: JSON.parse(result),
        });
      });
    });
  }

  render() {
    return (
      <div>
        <Col md={9} mdOffset={2} sm={9} smOffset={2} xs={10}  xsOffset={1}lg={9} lgOffset={2}>
          <Form inline>
            <FormGroup className="search-field">
              <FormControl
                name="query"
                type="text"
                placeholder="City, State"
                onChange={this.setQuery}
                maxLength="47"
              />
              <Button bsStyle="info" className="search-button" onClick={this.retrieveSearchData}>Search</Button>
            </FormGroup>
          </Form>
        </Col>
        {this.state.barList.map((result, key) => {
          const titleFontSize = result.name.length > 20 ? 'small-title' : 'large-title';
          const addressBar = result.address.length === 0 ? 'No Street Address' : result.address;

          return (
            <div key={key}>
              <Col md={8} mdOffset={2} sm={12} xs={12} lg={8} lgOffset={2}>
                <Media className="card">
                  <Media.Left align="top">
                    <Image className="clubImage" src={result.image_url} alt={result.name} />
                  </Media.Left>
                  <Media.Body>
                    <p className={`card-title ${titleFontSize}`}>{result.name}</p>
                    <Button className="RSVP" bsStyle="danger" name={result.id} onClick={this.addSelf}>{result.RSVPmessage}</Button>
                    <div className="address">
                      <p>{addressBar}</p>
                      <p>{`${result.city}, ${result.state} ${result.zipcode}`}</p>
                    </div>
                    <Row>
                      <Col md={8} mdOffset={2} sm={12} xs={12} lg={12} lgOffset={0}>
                        <div className="cardBottom">
                          <p className="going-message">{result.goingMessage}</p>
                          <p className="rating-message">{`Rating: ${result.stars}`}</p>
                          <Button name={result.id} className="goingButton" bsStyle="danger" onClick={this.toggleGoingModal}>{"See Who's Going"}</Button>
                        </div>
                      </Col>
                    </Row>
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
              (<a key={key} href={`https://twitter.com/${attendee}`} target="_blank">
                <b>{`@${attendee},`}
                </b>
              </a>)
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
  barList: React.PropTypes.array,
  query: React.PropTypes.string,
  attendeeList: React.PropTypes.object,
  showModal: React.PropTypes.bool,
};

export default YelpList;
