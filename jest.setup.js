const React = require('react');

// Mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props) => {
    // eslint-disable-next-line @next/next/no-img-element
    return React.createElement('img', { 
        ...props, 
        fill: props.fill ? "true" : undefined 
    });
  },
}));
