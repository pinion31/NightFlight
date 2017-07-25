import React, {Component} from 'react';
//import {Yelp as yelp} from 'yelp-fusion';
//const yelp = require('yelp-fusion');
import 'whatwg-fetch';

class YelpList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      barList:[],
    };

    this.retrieveSearchData = this.retrieveSearchData.bind(this);
  }

  componentDidMount() {
    this.retrieveSearchData();
  }

  retrieveSearchData() {
    fetch('/list', {
      method: 'GET',
      headers: {'Content-Type': 'application/json'},
    }).then (res => {
        res.json().then(result => {
            console.dir(result);
            console.log(typeof result);
            this.setState({
              barList: JSON.parse(result),
            });

        });

    });



/*
    yelp.accessToken(clientId, clientSecret).then(response => {
      const client = yelp.client(response.jsonBody.access_token);

      client.search(searchRequest).then(response => {
        const firstResult = response.jsonBody.businesses[0];
        const prettyJson = JSON.stringify(firstResult, null, 4);
        console.log(prettyJson);
        });
    }).catch(e => {
      console.log(e);
    });*/
  }

  render() {
    return (
    <div>
    {this.state.barList.map((result,key) => {
        return (
          <div key={key}>
            <img src={result.image_url} alt={result.name} style={{width:'304px', height:'228px'}}/>
            <p>{result.name}</p>
            <p>{result.rating}</p>
          </div>
        );

     })
    }
    </div>
    );
  }

}

YelpList.propTypes =  {
  resultList:React.PropTypes.array,
};

export default YelpList
