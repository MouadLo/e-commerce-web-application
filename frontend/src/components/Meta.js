import React from 'react';
import { Helmet } from 'react-helmet';

const Meta = ({ title, description, keywords }) => {
	return (
		<>
			<Helmet>
				<meta charSet="utf-8" />
				<title>{title}</title>
				<meta name="description" content={description}></meta>
				<meta name="keywords" content={keywords}></meta>
			</Helmet>
		</>
	);
};

Meta.defaultProps = {
	title: 'Lsmarket.com | Save Money. Live Better',
	description:
		'Shop Lsmarket.com for Every Day Low Prices. Free Shipping on Orders $35+ or Pickup In-Store and get a Pickup Discount',
	keywords: 'electronics, but electronics, cheap electronics',
};

export default Meta;
