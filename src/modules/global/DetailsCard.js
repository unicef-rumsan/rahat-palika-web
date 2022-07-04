import React from 'react';
import { Card, CardTitle, Col, Row } from 'reactstrap';

import '../../assets/css/project.css';
import { PROJECT_STATUS } from '../../constants';
import { formatBalanceAndCurrency } from '../../utils';

export default function DetailsCard(props) {
	const { title, button_name, name, name_value, total, total_value, handleButtonClick } = props;

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
						<Col>
							<div style={{ float: 'right' }}>
								{title === 'Project Details' ? (
									<button
										type="none"
										className={`btn btn-${PROJECT_STATUS.CLOSED ? 'danger' : 'success'}`}
										style={{ borderRadius: '8px', cursor: 'default' }}
									>
										{PROJECT_STATUS.CLOSED ? 'Closed' : 'Active'}
									</button>
								) : (
									<button
										onClick={handleButtonClick}
										type="button"
										className="btn waves-effect waves-light btn-outline-info"
										style={{ borderRadius: '8px' }}
									>
										{button_name || 'button'}
									</button>
								)}
							</div>
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
							<p className="card-font-bold">{formatBalanceAndCurrency(total_value) || '0'}</p>
							<div className="sub-title">{total || 'No Label'}</div>
						</Col>
					</Row>
				</div>
			</Card>
		</div>
	);
}
