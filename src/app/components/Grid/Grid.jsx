import React, { Component } from 'react';
import { toArray } from 'lodash';

import Flap from 'app/components/Flap';
import { wordwrap } from 'app/utility/wrap';

class Grid extends Component {
  constructor(props) {
    super(props);

    this.getDimensions = this.getDimensions.bind(this);
    this.displayMessage = this.displayMessage.bind(this);
    this.renderFlaps = this.renderFlaps.bind(this);

    this.state = {
      ...this.getDimensions(props),
      lines: [],
    }
  }

  componentDidMount() {
    this.setState({
      lines: this.displayMessage(),
    });
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      ...this.getDimensions(nextProps),
      lines: this.displayMessage(nextProps.message),
    });
  }

  getDimensions(props) {
    const { width, height, rows, columns, rowGap, columnGap } = props || this.props;
    const flapHeight = (height - (rowGap * (rows - 1))) / rows;
    const flapWidth = columns ? (width - (columnGap * (columns - 1))) / columns : flapHeight * 0.7;
    const columnCount = columns || Math.floor(width / (flapWidth + columnGap));

    return {
      rows,
      columns: columnCount,
      flapWidth,
      flapHeight,
    }
  }

  displayMessage(args) {
    const { message, lines, options = {} } = args || {};
    const { rows, columns } = this.state;
    let processedLines = [];


    const padding = options.padding || 0;
    if (lines) {
      // Lines specified in request, convert strings to arrays
      processedLines = lines.map(line => toArray(line).slice(0, columns - (padding * 2)));
      if (padding > 0) {
        processedLines = processedLines.map(line => {
          for (let i = 0; i < padding; i += 1) {
            line.unshift(' ');
          }
          return line;
        });
      }
    } else if (message) {
      // Format message to wrap words
      const messageAsLines = wordwrap(message, { width: (columns - (padding * 2)) });
      const messageArray = toArray(message);
      // Convert line start/stop values into line arrays
      processedLines = messageAsLines.map(line => {
        if (padding === 0) {
          // Return line array
          return messageArray.slice(line.start, line.end)
        } else {
          // Return line array with padding
          const paddedArray = messageArray.slice(line.start, line.end);
          for (let i = 0; i < padding; i += 1) {
            paddedArray.unshift(' ');
          }
          return paddedArray;
        }
      });
    }

    if (options.center) {
      // Center text on each line
      processedLines = processedLines.map(line => {
        const charsToAdd = Math.floor((columns - line.length - padding) / 2);
        const newLine = line;
        for (let i = 0; i < charsToAdd; i += 1) {
          newLine.unshift(' ');
        }
        return newLine;
      });
    }

    if (options.middle) {
      // Vertically center processed lines
      const linesToAdd = Math.floor((rows - processedLines.length) / 2);
      for (let i = 0; i < linesToAdd; i += 1) {
        processedLines.unshift([]);
      }
    } else if (options.offsetTop) {
      // Add blank lines above processed lines
      for (let i = 0; i < options.offsetTop; i += 1) {
        processedLines.unshift([]);
      }
    }

    return processedLines;
  }

  renderFlaps() {
    const { rows, columns, flapWidth, flapHeight, lines } = this.state;
    const flaps = [];

    for (let y = 0; y < rows; y += 1) {
      const thisLine = lines[y] || [];
      for (let x = 0; x < columns; x += 1) {
        const thisLetter = thisLine[x] || ' ';
        flaps.push(
          <Flap
            key={(y * columns) + x}
            letter={thisLetter}
            width={flapWidth}
            height={flapHeight}
            borderRadius={5}
          />
        );
      }
    }

    return flaps;
  }

  render() {
    const { width, height, rowGap, columnGap } = this.props;
    const { rows, columns, flapWidth, flapHeight } = this.state;

    return (
      <div
        style={{
          width: `${width}px`,
          height: `${height}px`,
          justifyContent: 'center',
          alignContent: 'center',
          display: 'grid',
          gridRowGap: rowGap,
          gridColumnGap: columnGap,
          gridTemplateColumns: `repeat(${columns}, ${flapWidth}px)`,
          gridTemplateRows: `repeat(${rows}, ${flapHeight}px)`,
        }}
      >
        {this.renderFlaps()}
      </div>
    );
  }
}

Grid.defaultProps = {
  rows: 5,
  rowGap: 5,
  columnGap: 5,
}

export default Grid;
