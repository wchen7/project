import { shallow } from 'enzyme';
import React from 'react';
import AnswerButton from './AnswerButton';
import { Button } from '@mui/material';

describe('AnswerButton', () => {
  const onClickMock = jest.fn();
  const props = {
    answer: 'Example Answer',
    color: 'primary',
    onClick: onClickMock,
  };
  const wrapper = shallow(<AnswerButton {...props} />);

  it('Button should render with correct text', () => {
    expect(wrapper.text()).toEqual(props.answer);
  });

  it('Button should call the onClick callback when clicked', () => {
    wrapper.simulate('click');
    expect(onClickMock).toHaveBeenCalledTimes(1);
  });

  it('Button should have the correct styles', () => {
    const styles = wrapper.find(Button).prop('sx');
    expect(styles.fontSize).toEqual('14pt');
    expect(styles.width).toEqual('200px');
    expect(styles.height).toEqual('100px');
    expect(styles.flex).toEqual('0 1 30%');
    expect(styles.margin).toEqual('5px');
    expect(styles.borderRadius).toEqual('1em');
    expect(styles.textAlign).toEqual('center');
  });

  it('Button should render the correct color and variant props', () => {
    expect(wrapper.find(Button).prop('color')).toEqual(props.color);
    expect(wrapper.find(Button).prop('variant')).toEqual('contained');
  });
});
