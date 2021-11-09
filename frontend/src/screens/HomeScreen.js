import React, { useEffect } from 'react';
import { Col, Row } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Product from '../components/Product';
import Loader from '../components/Loader';
import Message from '../components/Message';
import Paginate from '../components/Paginate';
import { listProduct } from '../actions/productActions';

const HomeScreen = ({ match }) => {
	const keyword = match.params.keyword;
	const pageNumber = match.params.pageNumber;

	const dispatch = useDispatch();

	const productList = useSelector((state) => state.productList);
	const { loading, error, products, pages, page } = productList;

	useEffect(async () => {
		dispatch(listProduct(keyword, pageNumber));
	}, [keyword, keyword, pageNumber]);

	return (
		<>
			<h1>Latest Products</h1>
			{loading ? (
				<Loader />
			) : error ? (
				<Message variant="danger">{error}</Message>
			) : (
				<>
					<Row>
						{products.map((product, index) => {
							return (
								<Col key={index} sm={12} md={6} lg={4} xl={3}>
									<Product product={product} />
								</Col>
							);
						})}
					</Row>
					<Row className="align-items-center justify-content-center">
						<Col>
							<Paginate
								pages={pages}
								page={page}
								keyword={keyword ? keyword : ''}
							/>
						</Col>
					</Row>
				</>
			)}
		</>
	);
};

export default HomeScreen;
