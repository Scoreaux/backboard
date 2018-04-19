import OAuth from 'client-oauth2';

class Connector {
  constructor(oauth, options) {
    this.oauth = oauth;

    this.receiveAuthorizationCode = this.receiveAuthorizationCode.bind(this);
    this.refreshToken = this.refreshToken.bind(this);
  }
}

export default Connector;
