import React, { Component } from 'react';

import styles from './Options.scss';

class Options extends Component {
  constructor(props) {
    super(props);

    this.state = {
      visible: false,
      options: this.props.options,
      message: '',
    };

    this.toggleVisibility = this.toggleVisibility.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onMessageChange = this.onMessageChange.bind(this);
  }

  toggleVisibility() {
    this.setState(state => ({
      visible: !state.visible
    }));
  }

  onChange(e) {
    this.setState({
      options: {
        ...this.state.values,
        [e.target.name]: e.target.value,
      }
    }, () => {
      this.props.onChange(this.state.options);
    });
  }

  onMessageChange(e) {
    this.setState({
      message: e.target.value,
    });
  }

  render() {
    const { visible, options, message } = this.state;

    return (
      <div className={`${styles.container} ${visible ? styles.visible : ''}`}>
        <div className={styles.content}>
          <h1 className="mb2">Options</h1>

          <div className="mb2">
            <h2>Rows</h2>
            <div>
              <input
                type="range"
                name="rows"
                className={styles.range}
                min={1}
                max={16}
                step={1}
                value={options.rows}
                onChange={this.onChange}
              />
            </div>
          </div>

          <div>
            <h2>Message</h2>
            <div>
              <textarea
                rows={options.rows}
                value={message}
                className={styles.textInput}
                onChange={this.onMessageChange}
              />
              <button
                className={styles.btn}
                onClick={() => this.props.setMessage({ message })}
              >
                Display
              </button>
              <button
                className={styles.btn}
                onClick={() => this.props.setMessage({ message: '' })}
              >
                Clear
              </button>
            </div>
          </div>

        </div>
        <div
          className={styles.toggle}
          onClick={this.toggleVisibility}
        />
      </div>
    );
  }
}

export default Options;
