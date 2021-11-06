import React, { useEffect } from 'react';
import { Button, Row, Col, ListGroup, Image, Card } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';
import CheckoutSteps from '../components/CheckoutSteps';
import { Link } from 'react-router-dom';
import { addOrder } from '../actions/orderActions';
import Loader from '../components/Loader';

const PlaceOrderScreen = ({ history }) => {
	const cart = useSelector((state) => state.cart);
	const dispatch = useDispatch();

	const orderCreate = useSelector((state) => state.orderCreate);
	const { error, success, loading, order } = orderCreate;

	// Calculate princes
	const addDecimals = (num) => {
		return (Math.round(num * 100) / 100).toFixed(2);
	};
	cart.itemsPrice = addDecimals(
		cart.cartItems.reduce((acc, item) => acc + item.price * item.qty, 0)
	);

	cart.shippingPrice =
		cart.itemsPrice > 100 ? addDecimals(0) : addDecimals(100);
	cart.taxPrice = addDecimals(Number((0.15 * cart.itemsPrice).toFixed(2)));
	cart.totalPrice = addDecimals(
		Number(cart.itemsPrice) + Number(cart.shippingPrice) + Number(cart.taxPrice)
	);

	useEffect(() => {
		if (success) {
			history.push(`/order/${order._id}`);
		}
	}, [history, success]);

	const placeOrderHandler = () => {
		dispatch(
			addOrder({
				orderItems: cart.cartItems,
				shippingAddress: cart.shippingAddress,
				paymentMethod: cart.paymentMethod,
				itemsPrice: cart.itemsPrice,
				taxPrice: cart.taxPrice,
				shippingPrice: cart.shippingPrice,
				totalPrice: cart.totalPrice,
			})
		);
	};
	return (
		<>
			<CheckoutSteps step1 step2 step3 step4 />

			{loading && <Loader />}
			<Row>
				<Col md={8}>
					<ListGroup variant="flush">
						<ListGroup.Item>
							<h2>Shipping</h2>
							<p>
								<strong>Address: </strong>
								{cart.shippingAddress.address}, {cart.shippingAddress.city}{' '}
								{cart.shippingAddress.postalCode} {cart.shippingAddress.country}
							</p>
						</ListGroup.Item>
						<ListGroup.Item>
							<h2>Payment Method</h2>
							<strong>Method: </strong>
							{cart.paymentAddress}
						</ListGroup.Item>

						<ListGroup.Item>
							<h2>Order Items</h2>
							{cart.cartItems.length === 0 ? (
								<Message>Your cart is empty</Message>
							) : (
								<ListGroup variant="flush">
									{cart.cartItems.map((item, index) => (
										<Row key={index}>
											<Col md={1}>
												<Image src={item.image} alt={item.nam} fluid rounded />
											</Col>
											<Col>
												<Link to={`/product/${item.product}`}>{item.name}</Link>
											</Col>
											<Col md={4}>
												{item.qty} x $ {item.price} = $ {item.price * item.qty}
											</Col>
										</Row>
									))}
								</ListGroup>
							)}
						</ListGroup.Item>
					</ListGroup>
				</Col>
				<Col md={4}>
					<Card>
						<ListGroup variant="flush">
							<ListGroup.Item>
								<h2>Order Summary</h2>
							</ListGroup.Item>
							<ListGroup.Item>
								<Row>
									<Col>Items</Col>
									<Col>$ {cart.itemsPrice}</Col>
								</Row>
							</ListGroup.Item>
							<ListGroup.Item>
								<Row>
									<Col>Shipping</Col>
									<Col>$ {cart.shippingPrice}</Col>
								</Row>
							</ListGroup.Item>
							<ListGroup.Item>
								<Row>
									<Col>Tax</Col>
									<Col>$ {cart.taxPrice}</Col>
								</Row>
							</ListGroup.Item>
							<ListGroup.Item>
								<Row>
									<Col>Total</Col>
									<Col>$ {cart.totalPrice}</Col>
								</Row>
							</ListGroup.Item>
							<ListGroup.Item>
								{error && <Message variant="danger">{error}</Message>}
							</ListGroup.Item>
							<ListGroup.Item>
								<Button
									type="button"
									className="btn-block"
									disabled={cart.cartItems.length === 0 ? true : false}
									onClick={placeOrderHandler}
								>
									Place Order
								</Button>
							</ListGroup.Item>
						</ListGroup>
					</Card>
				</Col>
			</Row>
		</>
	);
};

export default PlaceOrderScreen;
