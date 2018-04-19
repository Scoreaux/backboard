import Connector from './connector';
import axios from 'axios';

class TwitchConnector extends Connector {
  constructor(options) {
    super({
      clientId: 'jajd6ygukyzdbtud1fbolopq806tcl',
      clientSecret: '8hhgso86c09e1i48upo2wb7qklr1wq',
      accessTokenUri: 'https://id.twitch.tv/oauth2/token',
      authorizationUri: 'https://id.twitch.tv/oauth2/authorize',
      redirectUri: 'http://localhost:5555/auth/twitch',
      scopes: ['chat_login', 'channel_subscriptions', 'user_read', 'channel_check_subscription', 'bits:read'],
    }, options);
  }

  async receiveAuthorizationCode(req, res) {
    try {
      // Check that request contains authorization code
      if (req.query.code) {
        // Request user access token from Twitch using authorization code
        const response = await axios.post(this.oauth.accessTokenUri, {}, {
          params: {
            client_id: this.oauth.clientId,
            client_secret: this.oauth.clientSecret,
            code: req.query.code,
            grant_type: 'authorization_code',
            redirect_uri: this.oauth.redirectUri,
          },
        });

        // Save response as user object
        this.user = response.data;
      }
    } catch (error) {
      // Error occurred
      console.log('Error occurred getting user access token', error);
    }

    // Send success response to Twitch
    res.status(200).send();
  }

  async refreshToken() {
    try {
      // Check if user object exists
      if (this.user) {
        // Request new user access token from Twitch using refresh token
        const response = await axios.post(this.oauth.accessTokenUri, null, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          params: {
            client_id: this.oauth.clientId,
            client_secret: this.oauth.clientSecret,
            grant_type: 'refresh_token',
            refresh_token: this.user.refresh_token,
          },
        });

        // Save response as user object
        this.user = response.data;
      }
    } catch (error) {
      // Error occurred
      console.log('Error refreshing token', error);
    }
  }
}

export default TwitchConnector;

// https://id.twitch.tv/oauth2/authorize?client_id=jajd6ygukyzdbtud1fbolopq806tcl&redirect_uri=http://localhost:5555/auth/twitch&response_type=code&scope=user_read&force_verify=true
