import React from 'react';

class ChildComponent extends React.Component {
  state = {
    count: 0,
  }

  render() {
    return (
      <div>
        <button
          onClick={() => this.setState(({ count }) => ({ count: count + 1 }))}
        >I've been clicked {this.state.count} times
        </button>
      </div>
    );
  }
};

export default ChildComponent;
