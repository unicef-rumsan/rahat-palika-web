import React from 'react';
import { Card, CardTitle, Col, Row } from 'reactstrap';

import '../../assets/css/project.css';
import { formatBalanceAndCurrency } from '../../utils';

export default function DetailsCard(props) {
	const { title, name, name_value, total, total_value } = props;

	return (
		<div>
			<Card>
				<div className="stat-card-body" style={{ minHeight: 120 }}>
					<Row>
						<Col>
							<CardTitle className="title" style={{ flexBasis: '70%' }}>
								{title || 'No Title'}
							</CardTitle>
						</Col>
					</Row>
					<Row>
						<Col md="8" sm="12" style={{ marginBottom: '10px' }}>
							<div style={{ display: 'flex', alignItems: 'center' }}>
								<div>
									<p className="card-font-medium">{name_value || '-'}</p>
									<div className="sub-title">{name || 'No Label'}</div>
								</div>
							</div>
						</Col>
						<Col md="4" sm="12">
							<p className="card-font-medium">{formatBalanceAndCurrency(total_value) || '0'}</p>
							<div className="sub-title">{total || 'No Label'}</div>
						</Col>
					</Row>
				</div>
			</Card>
		</div>
	);
}
