import React, { Component } from 'react';
import { AutoSizer } from 'react-virtualized';
import { ipcRenderer as ipc } from 'electron';

import Grid from 'app/components/Grid';
import Options from 'app/components/Options';

import styles from './App.scss';

ipc.on('displayMessage', (e, message) => {
  if (window.setMessage) {
    window.setMessage(message);
  }
});

ipc.on('getDimensions', (e) => {
  if (window.gridComponent) {
    e.sender.send('getDimensions', window.gridComponent.getDimensions());
  } else {
    e.sender.send('getDimensions', { error: 'Grid component not mounted' });
  }
});

class App extends Component {
  constructor(props) {
    super(props);

    this.setMessage = this.setMessage.bind(this);
    this.onOptionsChange = this.onOptionsChange.bind(this);
    window.setMessage = this.setMessage;

    this.state = {
      message: null,
      options: {
        rows: 8,
      }
    };
  }

  setMessage(message) {
    this.setState({
      message,
    });
  }

  onOptionsChange(options) {
    this.setState({
      options,
    });
  }

  render() {
    const { message, options } = this.state;

    return (
      <div className={styles.container}>
        <div>
          <AutoSizer>
            {({ width, height }) => (
              <Grid
                width={width}
                height={height}
                message={message}
                columnGap={4}
                rowGap={20}
                rows={options.rows}
                ref={(e) => { this.grid = e; window.gridComponent = e; }}
              />
            )}
          </AutoSizer>
        </div>
        <Options
          options={options}
          onChange={this.onOptionsChange}
          setMessage={this.setMessage}
        />
        <div className={styles.cursorHider} />
      </div>
    );
  }
}

export default App;
