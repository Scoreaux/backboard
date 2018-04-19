import React, { Component } from 'react';
import _ from 'lodash';

import styles from './Flap.scss';

const letters = _.toArray('ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789.,?!_-@ ');

class Flap extends Component {
  constructor(props) {
    super(props);

    this.transitionLetter = this.transitionLetter.bind(this);

    this.state = {
      targetLetter: props.letter.toUpperCase(),
      activeLetter: props.letter.toUpperCase(),
      previousLetter: null,
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.letter.toUpperCase() !== this.state.activeLetter) {
      this.setState(state => ({
        targetLetter: nextProps.letter.toUpperCase(),
      }), () => {
        if (!this.state.previousLetter) {
          this.transitionLetter();
        }
      });
    }
  }

  transitionLetter() {
    const { targetLetter, activeLetter } = this.state;

    let activeLetterPos = letters.indexOf(activeLetter);
    if (activeLetterPos >= letters.length - 1) {
      activeLetterPos = -1;
    }
    let nextLetter = letters[activeLetterPos + 1];
    if (activeLetterPos === -1 && letters.indexOf(targetLetter) === -1) {
      nextLetter = targetLetter;
    }


    this.setState(state => ({
      activeLetter: nextLetter.toUpperCase(),
      previousLetter: state.activeLetter,
    }), (newState) => {
      this.overlayTop.animate({
        transform: ['rotateX(0)', 'rotateX(-90deg)'],
        filter: ['brightness(1)', 'brightness(0.5)'],
      }, {
        duration: this.props.duration / 2,
        easing: 'ease-in',
        fill: 'forwards',
      });

      this.overlayBottom.animate({
        transform: ['rotateX(90deg)', 'rotateX(90deg)', 'rotateX(0deg)'],
        filter: ['brightness(1.2)', 'brightness(1.2)', 'brightness(1)'],
      }, {
        duration: this.props.duration,
        easing: 'ease-in-out',
        fill: 'forwards',
      });

      setTimeout(() => {
        if (nextLetter !== targetLetter) {
          this.transitionLetter();
        } else {
          this.setState({
            previousLetter: null,
          });
        }
      }, this.props.duration + this.props.pause + (Math.random() * 50));
    });
  }

  render() {
    const { activeLetter, previousLetter } = this.state;
    const { width, height, gap, borderRadius } = this.props;

    const flapStyle = {
      width: width,
      height: `calc(${height}px / 2)`,
      lineHeight: `${height + gap}px`,
      fontSize: width < height ? width : height,
    };

    const topFlapStyle = {
      marginBottom: gap,
      transformOrigin: `50% calc(100% + (${gap}px / 2))`,
      borderRadius: `${borderRadius}px ${borderRadius}px 0 0`,
    }

    const bottomFlapStyle = {
      transformOrigin: `50% calc(0% - (${gap}px / 2))`,
      borderRadius: `0 0 ${borderRadius}px ${borderRadius}px`,
    }

    return (
      <div className={styles.container}>
        <div
          className={`${styles.flap} ${styles.top}`}
          style={{ ...flapStyle, ...topFlapStyle }}
        >
          {activeLetter}
        </div>
        <div
          className={`${styles.flap} ${styles.bottom}`}
          style={{ ...flapStyle, ...bottomFlapStyle }}
        >
          {previousLetter || activeLetter}
        </div>

        <div
          className={`${styles.overlay} ${previousLetter ? styles.visible : ''}`}
        >
          <div
            className={`${styles.flap} ${styles.top}`}
            style={{ ...flapStyle, ...topFlapStyle }}
            ref={(e) => { this.overlayTop = e; }}
          >
            {previousLetter}
          </div>
          <div
            className={`${styles.flap} ${styles.bottom}`}
            style={{ ...flapStyle, ...bottomFlapStyle }}
            ref={(e) => { this.overlayBottom = e; }}
          >
            {activeLetter}
          </div>
        </div>
      </div>
    )
  }
}

Flap.defaultProps = {
  duration: 180,
  pause: 20,
  width: 80,
  height: 110,
  gap: 2,
  borderRadius: 4,
  letter: ' ',
}

export default Flap;
