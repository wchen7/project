import React from 'react';
import { shallow } from 'enzyme';
import ButtonAppBar from './NavBar';
import { MemoryRouter } from 'react-router-dom';

describe('ButtonAppBar', () => {
  it('renders without crashing', () => {
    shallow(<MemoryRouter>
        <ButtonAppBar />
        </MemoryRouter>);
  });
});
