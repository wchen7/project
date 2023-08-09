import { shallow } from 'enzyme';
import React from 'react';
import SideBar from './SideBar';
import { Button } from '@mui/material';

describe('SideBar', () => {
  it('renders without crashing', () => {
    const wrapper = shallow(<SideBar />);
    expect(wrapper.exists()).toBe(true);
  });
  it('should check if SideBar can contain a children prop', () => {
    const child = <div data-testid="test-child">Test child component</div>;
    const wrapper = shallow(<SideBar>{child}</SideBar>);
    expect(wrapper.contains(child)).toBe(true);
  });
  it('It Should contain a Button as children', () => {
    const wrapper = shallow(<SideBar> <Button>Add Game</Button></SideBar>);
    expect(wrapper.containsMatchingElement(Button)).toBe(true);
  });
  it('The Child Button should say Add Game', () => {
    const wrapper = shallow(<SideBar> <Button>Add Game</Button></SideBar>);
    const button = wrapper.find(Button);
    expect(button.text()).toEqual('Add Game');
  });
});
