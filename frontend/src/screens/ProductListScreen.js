import React, { useEffect, useState } from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import { Table, Button, Row, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import {
	deleteProduct,
	listProduct,
	createProduct,
} from '../actions/productActions';
import { PRODUCT_CREATE_RESET } from '../constants/productConstants';

import Loader from '../components/Loader';
import Message from '../components/Message';
import Paginate from '../components/Paginate';
import { Link } from 'react-router-dom';

const ProductListScreen = ({ history, match }) => {
	const pageNumber = match.params.pageNumber;
	const dispatch = useDispatch();

	const productDelete = useSelector((state) => state.productDelete);
	const {
		loading: loadingDelete,
		error: errorDelete,
		success: successDelete,
	} = productDelete;

	const productCreate = useSelector((state) => state.productCreate);
	const {
		loading: loadingCreate,
		error: errorCreate,
		product: createdProduct,
		success: successCreate,
	} = productCreate;

	const productList = useSelector((state) => state.productList);
	const { loading, error, products, pages, page } = productList;

	const userLogin = useSelector((state) => state.userLogin);
	const { userInfo } = userLogin;

	useEffect(() => {
		dispatch({ type: PRODUCT_CREATE_RESET });

		if (!userInfo.isAdmin) {
			history.push('/login');
		}

		if (successCreate) {
			history.push(`/admin/product/${createdProduct._id}/edit`);
		} else {
			dispatch(listProduct('', pageNumber));
		}
	}, [
		dispatch,
		history,
		userInfo,
		successDelete,
		successCreate,
		createProduct,
		pageNumber,
	]);

	const createProductHandler = () => {
		dispatch(createProduct());
	};

	const deleteHandler = (productId) => {
		if (window.confirm('Are you sure')) {
			dispatch(deleteProduct(productId));
		}
	};
	return (
		<>
			<Row className="align-items-center">
				<Col>
					<h1>Products</h1>
				</Col>
				<Col className="text-right">
					<Button className="my-3" onClick={createProductHandler}>
						<i className="fas fa-plus"></i>Create Product
					</Button>
				</Col>
			</Row>
			{loadingDelete && <Loader />}
			{errorDelete && <Message variant="danger">{errorDelete}</Message>}
			{loadingCreate && <Loader />}
			{errorCreate && <Message variant="danger">{errorCreate}</Message>}
			{loading ? (
				<Loader />
			) : error ? (
				<Message variant="danger">{error}</Message>
			) : (
				<>
					<Table striped bordered hover responsive className="table-sm">
						<thead>
							<tr>
								<th>ID</th>
								<th>Name</th>
								<th>Price</th>
								<th>Category</th>
								<th>Brand</th>
								<th></th>
							</tr>
						</thead>
						<tbody>
							{products.map((product, index) => (
								<tr key={index}>
									<td>
										<Link to={`/product/${product._id}`}>{product._id}</Link>
									</td>
									<td>{product.name}</td>
									<td>$ {product.price}</td>
									<td>{product.category}</td>
									<td>{product.brand}</td>
									<td>
										<LinkContainer to={`/admin/product/${product._id}/edit`}>
											<Button variant="light" className="btn-sm">
												<i className="fas fa-edit"></i>
											</Button>
										</LinkContainer>
										<Button
											variant="danger"
											className="bbtn-sm"
											onClick={() => deleteHandler(product._id)}
										>
											<i className="fas fa-trash"></i>{' '}
										</Button>
									</td>
								</tr>
							))}
						</tbody>
					</Table>
					<Paginate pages={pages} page={page} isAdmin={true} />
				</>
			)}
		</>
	);
};

export default ProductListScreen;
