import React, { Component } from 'react';
import _ from 'lodash';

import styles from './Flap.scss';

const letters = _.toArray(' ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789.,!-');

class Flap extends Component {
  constructor(props) {
    super(props);

    this.transitionLetter = this.transitionLetter.bind(this);

    this.targetLetter = props.letter.toUpperCase();
    this.activeLetter = props.letter.toUpperCase();
    this.previousLetter = null;
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.letter.toUpperCase() !== this.activeLetter) {
      this.targetLetter = nextProps.letter.toUpperCase();
      clearTimeout(this.timeout);
      this.transitionLetter();
    }
  }

  transitionLetter() {
    const { targetLetter, activeLetter } = this;

    let activeLetterPos = letters.indexOf(activeLetter);
    if (activeLetterPos >= letters.length - 1) {
      activeLetterPos = -1;
    }
    let nextLetter = letters[activeLetterPos + 1];
    if (activeLetterPos === -1 && letters.indexOf(targetLetter) === -1) {
      nextLetter = targetLetter;
    }

    this.previousLetter = this.activeLetter;
    this.activeLetter = nextLetter.toUpperCase();

    this.flapTop.innerHTML = this.activeLetter;
    this.flapBottom.innerHTML = this.previousLetter || this.activeLetter;
    this.overlayTop.innerHTML = this.previousLetter || this.activeLetter;
    this.overlayBottom.innerHTML = this.activeLetter;


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

    this.timeout = setTimeout(() => {
      if (nextLetter !== targetLetter) {
        this.transitionLetter();
      } else {
        this.previousLetter = null;

        this.flapTop.innerHTML = this.activeLetter;
        this.flapBottom.innerHTML = this.previousLetter || this.activeLetter;
        this.overlayTop.innerHTML = this.previousLetter || this.activeLetter;
        this.overlayBottom.innerHTML = this.activeLetter;
        this.forceUpdate();
      }
    }, this.props.duration + this.props.pause + (Math.random() * 40));
  }

  render() {
    const { activeLetter, previousLetter } = this;
    const { width, height, gap, borderRadius } = this.props;

    const flapStyle = {
      width: width,
      height: `calc(${height}px / 2)`,
      lineHeight: `${height + (gap * height)}px`,
      fontSize: width < height ? width : height,
    };

    const topFlapStyle = {
      marginBottom: (gap * height),
      transformOrigin: `50% calc(100% + (${(gap * height)}px / 2))`,
      borderRadius: `${borderRadius}px ${borderRadius}px 0 0`,
    }

    const bottomFlapStyle = {
      transformOrigin: `50% calc(0% - (${(gap * height)}px / 2))`,
      borderRadius: `0 0 ${borderRadius}px ${borderRadius}px`,
    }

    return (
      <div className={styles.container}>
        <div
          className={`${styles.flap} ${styles.top}`}
          style={{ ...flapStyle, ...topFlapStyle }}
          ref={(e) => { this.flapTop = e; }}
        >
          {activeLetter}
        </div>
        <div
          className={`${styles.flap} ${styles.bottom}`}
          style={{ ...flapStyle, ...bottomFlapStyle }}
          ref={(e) => { this.flapBottom = e; }}
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
  duration: 160,
  pause: 20,
  width: 80,
  height: 110,
  gap: 0.03,
  borderRadius: 4,
  letter: ' ',
}

export default Flap;
