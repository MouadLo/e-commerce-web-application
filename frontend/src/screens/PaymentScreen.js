import React, { useState } from 'react';
import { Form, Button, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import FormContainer from '../components/FormContainer';
import CheckoutSteps from '../components/CheckoutSteps';
import { savePaymentMethod } from '../actions/cartActions';

function PaymentScreen({ history }) {
	const cart = useSelector((state) => state.cart);
	const { shippingAddress } = cart;

	if (!shippingAddress) {
		history.push('/shipping');
	}

	const [paymentMethod, setPaymentMethod] = useState('');

	const dispatch = useDispatch();

	const submitHandler = (e) => {
		e.preventDefault();
		dispatch(savePaymentMethod(paymentMethod));
		history.push('/placeorder');
	};

	const handleChange = (e) => {
		setPaymentMethod(e.target.value);
	};
	return (
		<FormContainer>
			<CheckoutSteps step1 step2 step3 />
			<h2>Payment Method</h2>
			<Form onSubmit={submitHandler}>
				<Form.Group>
					<Form.Label as="legend">Select Method</Form.Label>

					<Col>
						<Form.Check
							type="radio"
							label="Paypal or Credit Card"
							id="Paypal"
							name="paymentMethod"
							value="Paypal"
							onChange={handleChange}
						></Form.Check>
						<Form.Check
							type="radio"
							label="Stripe"
							id="Stripe"
							name="paymentMethod"
							value="Stripe"
							onChange={handleChange}
						></Form.Check>
					</Col>
				</Form.Group>
				<Button type="submit" variant="primary">
					Continue
				</Button>
			</Form>
		</FormContainer>
	);
}

export default PaymentScreen;
