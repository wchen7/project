import React from 'react';
import { shallow, mount } from 'enzyme';
import FormComponents from './Form';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';

describe('FormComponents', () => {
  it('should render a FormControl component', () => {
    const wrapper = shallow(<FormComponents />);
    expect(wrapper.find(FormControl)).toHaveLength(1);
  });

  it('should render a FormLabel component with text "Question Type"', () => {
    const wrapper = shallow(<FormComponents />);
    expect(wrapper.find(FormLabel).text()).toEqual(' Question Type');
  });

  // Had to use mount because this was deeply nested within FormComponents and
  // could not use shallow due to it not being direct children of FormComponents
  it('should render a RadioGroup component with two options', () => {
    const wrapper = mount(<FormComponents />);
    const radioGroupWrapper = wrapper.find(RadioGroup);
    expect(radioGroupWrapper.find(FormControlLabel)).toHaveLength(2);
    expect(radioGroupWrapper.find(Radio)).toHaveLength(2);
  });

  it('should have a default value of "SingleChoice"', () => {
    const wrapper = shallow(<FormComponents />);
    expect(wrapper.find(RadioGroup).prop('defaultValue')).toEqual('SingleChoice');
  });

  // Had to use mount because this was deeply nested within FormComponents and
  // could not use shallow due to it not being direct children of FormComponents
  it('should set the option to the new value when the other radio button is clicked', () => {
    const setTypeMock = jest.fn();
    const wrapper = mount(<FormComponents setType={setTypeMock} type='SingleChoice' />);
    const multipleChoiceRadio = wrapper.find('input[value="MultipleChoice"]');
    multipleChoiceRadio.simulate('change', { target: { value: 'MultipleChoice' } });
    expect(setTypeMock).toHaveBeenCalledWith('MultipleChoice');
  });

  it('checks that the option changed to MultipleChoice', () => {
    const wrapper = shallow(<FormComponents type="MultipleChoice" />);
    expect(wrapper.find(RadioGroup).prop('value')).toEqual('MultipleChoice');
  });
});
