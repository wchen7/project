import { shallow } from 'enzyme';
import React from 'react';
import QuizControlCard from './AQuizDisplay';
import { CardMedia } from '@mui/material/';

describe('QuizControlCard', () => {
  const thumbnail = 'https://example.com/image.png';
  const children = <p>Quiz details</p>;
  it('It Should contain the Name of the Quiz', () => {
    const wrapper = shallow(<QuizControlCard>New Quiz</QuizControlCard>);
    expect(wrapper.text()).toEqual('New Quiz')
  });
  it('It should contain an image thumbnail', () => {
    const wrapper = shallow(<QuizControlCard thumbnail = {thumbnail}>New Quiz</QuizControlCard>);
    expect(wrapper.find(CardMedia).prop('src')).toBe('https://example.com/image.png');
  })
  it('renders the children content', () => {
    const wrapper = shallow(<QuizControlCard thumbnail={thumbnail}>{children}</QuizControlCard>);
    expect(wrapper.containsMatchingElement(children)).toEqual(true);
  });
});
