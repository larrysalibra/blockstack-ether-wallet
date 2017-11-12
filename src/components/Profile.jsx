import React, { Component } from 'react';
import {
  isSignInPending,
  loadUserData,
  Person,
} from 'blockstack';
import ethUtils from 'ethereumjs-util'
import { QRCode } from 'react-qr-svg'
const avatarFallbackImage = 'https://s3.amazonaws.com/onename/avatar-placeholder.png';

export default class Profile extends Component {
  constructor(props) {
  	super(props);

  	this.state = {
  	  person: {
  	  	name() {
          return 'Anonymous';
        },
  	  	avatarUrl() {
  	  	  return avatarFallbackImage;
  	  	},
  	  },
      showPrivateKey: false
  	};
    this.toggleShowPrivateKey = this.toggleShowPrivateKey.bind(this)
  }

  toggleShowPrivateKey(event) {
    event.preventDefault()
    const showPrivateKey = this.state.showPrivateKey
    this.setState({ showPrivateKey: !showPrivateKey })
  }

  render() {
    const { handleSignOut } = this.props;
    const { address, person, privateKey, showPrivateKey } = this.state;
    return (
      !isSignInPending() ?
      <div className="panel-welcome" id="section-2">
        <div className="avatar-section">
          <img src={ person.avatarUrl() ? person.avatarUrl() : avatarFallbackImage } className="img-rounded avatar" id="avatar-image" />
        </div>
        <h1><span id="heading-name">{ person.name() ? person.name() : 'Nameless Person' }’s<br/>Blockstack Ether Wallet</span>!</h1>
        <p>
          <label>Your address:</label>
          <br/>
          { address }
        </p>
        <div className="qrcode-wallet">
          <QRCode
            value={address}
          />
        </div>
        <p>
          <label>Your private key:</label>
          &nbsp;&nbsp;
          <a
            onClick={ this.toggleShowPrivateKey }
            href=""
          >
            {showPrivateKey ? 'Hide' : 'Show'}
          </a>
          <br/>
          {showPrivateKey ? privateKey : '* * * * * * * * * * * * *'}
        </p>
        <p className="lead">
          <button
            className="btn btn-primary btn-lg"
            id="signout-button"
            onClick={ handleSignOut.bind(this) }
          >
            Logout
          </button>
        </p>
      </div> : null
    );
  }

  componentWillMount() {
    const userData = loadUserData()
    const appPrivateKey = userData.appPrivateKey
    const privateKey = new Buffer(appPrivateKey, 'hex')
    const address = '0x' + ethUtils.privateToAddress(privateKey).toString('hex')
    this.setState({
      person: new Person(userData.profile),
      privateKey,
      address
    });
  }
}
