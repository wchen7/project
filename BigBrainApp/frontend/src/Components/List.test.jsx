import React from 'react';
import { shallow } from 'enzyme';
import MiddleDividers from './List';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

describe('MiddleDividers Component', () => {
  it('renders without crashing', () => {
    shallow(<MiddleDividers sessionInList={1} />);
  });

  it('renders the session counter correctly', () => {
    const wrapper = shallow(<MiddleDividers sessionInList={1} />);
    const sessionCounter = wrapper.find('#sessionCounter');
    expect(sessionCounter.text()).toEqual('Session 1');
  });

  it('renders the "View Results" button with correct link', () => {
    const wrapper = shallow(<MiddleDividers sessionInList={1} />);
    const viewResultsButton = wrapper.find(Button).first();
    expect(viewResultsButton.prop('to')).toEqual('/Dashboard/Results/1');
  });

  it('renders the "Test Your Knowledge" message correctly', () => {
    const wrapper = shallow(<MiddleDividers sessionInList={1} />);
    const message = wrapper.find(Typography).last();
    expect(message.text()).toContain('Test Your Knowledge');
  });
});
