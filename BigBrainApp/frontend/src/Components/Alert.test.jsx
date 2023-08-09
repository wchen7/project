import React from 'react';
import { shallow } from 'enzyme';
import AlertDialog from './Alert';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContentText from '@mui/material/DialogContentText';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));
const onClickMock = jest.fn();

describe('AlertDialog Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    shallow(<AlertDialog />);
  });

  it('opens the dialog when the button is clicked', () => {
    const wrapper = shallow(<AlertDialog onClick={onClickMock}/>);
    wrapper.find({ name: 'register-submit' }).simulate('click', { preventDefault: () => {} });
    expect(wrapper.find(Dialog).prop('open')).toEqual(true);
  });

  it('renders the title of the alert correctly', () => {
    const wrapper = shallow(<AlertDialog title="Test Title" />);
    const dialogTitle = wrapper.find(DialogTitle);
    expect(dialogTitle.text()).toEqual('Test Title');
  });

  it('renders the text in the alert correctly', () => {
    const wrapper = shallow(<AlertDialog text="Test Text" />);
    const dialogText = wrapper.find(DialogContentText);
    expect(dialogText.text()).toEqual('Test Text');
  });

  it('closes the dialog when the close button is clicked', () => {
    const wrapper = shallow(<AlertDialog onClick={onClickMock}/>);
    wrapper.find(Button).first().simulate('click', { preventDefault: () => {} });
    wrapper.find('[name="close-alert"]').first().simulate('click');
    const dialog = wrapper.find(Dialog);
    expect(dialog.prop('open')).toEqual(false);
  });
});
