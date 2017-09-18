webpackJsonp([1],{333:function(e,t,a){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}var l=a(0),r=n(l);a(225);var o=a(30),s=n(o),u=a(132);a(642);var i=a(643),d=n(i);s.default.render(r.default.createElement(u.HashRouter,null,r.default.createElement(d.default,null)),document.getElementById("app"))},642:function(e,t){},643:function(e,t,a){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"__esModule",{value:!0});var l=a(0),r=n(l),o=a(31),s=a(132),u=a(644),i=n(u),d=function(){return r.default.createElement("h2",null,"This page does not exist! Please go back!")},c=function(){return r.default.createElement("div",{className:"login"},r.default.createElement("a",{href:"/auth/twitter"},r.default.createElement("img",{src:"twitterbutton.png",alt:"sign in with twitter"})))},f=function(){return r.default.createElement(s.Switch,null,r.default.createElement(o.Route,{exact:!0,path:"/",component:c}),r.default.createElement(o.Route,{path:"/search/:id",component:i.default}),r.default.createElement(o.Route,{path:"*",component:d}))},m=function(){return r.default.createElement("div",{className:"footer"})},h=function(){return r.default.createElement("div",null,r.default.createElement("h1",{className:"homePageTitle"},"Night Flight"),r.default.createElement("h1",{className:"homePageTagline"},"Let Your Friends Know Where You Are Going Tonight."),r.default.createElement(f,null),r.default.createElement(m,null))};t.default=h},644:function(e,t,a){"use strict";function n(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function l(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function r(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{value:!0});var o=function(){function e(e,t){for(var a=0;a<t.length;a++){var n=t[a];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}return function(t,a,n){return a&&e(t.prototype,a),n&&e(t,n),t}}(),s=a(0),u=function(e){return e&&e.__esModule?e:{default:e}}(s),i=a(283);a(331);var d=function(e){function t(e){n(this,t);var a=l(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e));return a.state={barList:[],query:"",attendeeList:{list:[]},showModal:!1},a.retrieveSearchData=a.retrieveSearchData.bind(a),a.setQuery=a.setQuery.bind(a),a.addSelf=a.addSelf.bind(a),a.toggleGoingModal=a.toggleGoingModal.bind(a),a}return r(t,e),o(t,[{key:"setQuery",value:function(e){this.setState({query:e.target.value})}},{key:"retrieveSearchData",value:function(e){var t=this;e.preventDefault(),fetch("/list",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({query:this.state.query,name:this.props.match.params.id})}).then(function(e){e.json().then(function(e){t.setState({barList:JSON.parse(e)})})})}},{key:"toggleGoingModal",value:function(e){var t=this;this.state.showModal?this.setState({showModal:!1}):fetch("/getAttendees",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({id:e.target.name})}).then(function(e){e.json().then(function(e){t.setState({showModal:!0,attendeeList:e})})})}},{key:"addSelf",value:function(e){var t=this;fetch("/addSelf",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({username:this.props.match.params.id,id:e.target.name})}).then(function(e){e.json().then(function(e){t.setState({barList:JSON.parse(e)})})})}},{key:"render",value:function(){var e=this;return u.default.createElement("div",null,u.default.createElement(i.Col,{md:9,mdOffset:2,sm:9,smOffset:2,xs:10,xsOffset:1,lg:9,lgOffset:2},u.default.createElement(i.Form,{inline:!0},u.default.createElement(i.FormGroup,{className:"search-field"},u.default.createElement(i.FormControl,{name:"query",type:"text",placeholder:"City, State",onChange:this.setQuery,maxLength:"47"}),u.default.createElement(i.Button,{bsStyle:"info",className:"search-button",onClick:this.retrieveSearchData},"Search")))),this.state.barList.map(function(t,a){var n=t.name.length>20?"small-title":"large-title",l=0===t.address.length?"No Street Address":t.address;return u.default.createElement("div",{key:a},u.default.createElement(i.Col,{md:8,mdOffset:2,sm:12,xs:12,lg:8,lgOffset:2},u.default.createElement(i.Media,{className:"card"},u.default.createElement(i.Media.Left,{align:"top"},u.default.createElement(i.Image,{className:"clubImage",src:t.image_url,alt:t.name})),u.default.createElement(i.Media.Body,null,u.default.createElement("p",{className:"card-title "+n},t.name),u.default.createElement(i.Button,{className:"RSVP",bsStyle:"danger",name:t.id,onClick:e.addSelf},t.RSVPmessage),u.default.createElement("div",{className:"address"},u.default.createElement("p",null,l),u.default.createElement("p",null,t.city+", "+t.state+" "+t.zipcode)),u.default.createElement(i.Row,null,u.default.createElement(i.Col,{md:8,mdOffset:2,sm:12,xs:12,lg:12,lgOffset:0},u.default.createElement("div",{className:"cardBottom"},u.default.createElement("p",{className:"going-message"},t.goingMessage),u.default.createElement("p",{className:"rating-message"},"Rating: "+t.stars),u.default.createElement(i.Button,{name:t.id,className:"goingButton",bsStyle:"danger",onClick:e.toggleGoingModal},"See Who's Going"))))))))}),u.default.createElement(i.Modal,{show:this.state.showModal,bsSize:"small","aria-labelledby":"contained-modal-title-sm",onHide:this.toggleGoingModal},u.default.createElement(i.Modal.Header,{closeButton:!0},u.default.createElement(i.Modal.Title,{id:"contained-modal-title-sm"},"Club Attendees")),u.default.createElement(i.Modal.Body,null,this.state.attendeeList.list.map(function(e,t){return u.default.createElement("a",{key:t,href:"https://twitter.com/"+e,target:"_blank"},u.default.createElement("b",null,"@"+e+","))})),u.default.createElement(i.Modal.Footer,null,u.default.createElement(i.Button,{className:"goingButton",onClick:this.toggleGoingModal},"Close"))))}}]),t}(s.Component);d.propTypes={barList:u.default.PropTypes.array,query:u.default.PropTypes.string,attendeeList:u.default.PropTypes.object,showModal:u.default.PropTypes.bool},t.default=d}},[333]);