import { useState } from 'react'
import validateInfo from './validation';

const useForm = () => {
	const [validated, setValidated] = useState(false)
	const [values, setValues] = useState({
		cardName: '',
		cardNumber: '',
		cardType: '',
		cardExpiration: '',
		cardSecurityCode: '',
		cardPostalCode: '',
		focus: ''
	})

	const [errors, setErrors] = useState({})

	const handleFocus = (e) => {
		setValues({
			...values,
			focus: (e.target.name === 'cardSecurityCode') ? 'cvc' : e.target.name
		});
	}

	const handleChange = e => {
		const { name, value } = e.target
		setValues({
			...values,
			[name]: value
		})
	}

	const handleSubmit = e => {
		e.preventDefault()
		setErrors(validateInfo(values))
		if (validateInfo(values).message === 'Credit Card is valid') {
			setValidated(true)
		} else {
			setValidated(false)
		}
	};

	return { handleChange, handleFocus, handleSubmit, values, setValues, errors, validated };
};

export default useForm; 