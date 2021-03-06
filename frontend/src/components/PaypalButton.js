import React from 'react';
import ReactDOM from 'react-dom';

const PayPalButton = window.paypal.Buttons.driver('react', { React, ReactDOM });

function PypButton({ amount }) {
	const createOrder = (data, actions) => {
		console.log(data);
		return actions.order.create({
			purchase_units: [
				{
					amount: {
						value: amount,
					},
				},
			],
		});
	};

	const onApprove = (data, actions) => {
		console.log(data);
		return actions.order.capture();
	};

	return (
		<PayPalButton
			createOrder={(data, actions) => createOrder(data, actions)}
			onApprove={(data, actions) => onApprove(data, actions)}
		/>
	);
}

export default PypButton;
