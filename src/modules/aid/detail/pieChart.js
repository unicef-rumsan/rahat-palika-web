import React, { useEffect, useState } from 'react';
import { Card, CardBody, CardTitle, Col, Label, Row } from 'reactstrap';
import { Pie } from 'react-chartjs-2';
import Loading from '../../global/Loading';

export default function Chart({ available_tokens, total_tokens, fetching }) {
	const [pieData, setPieData] = useState({ labels: [], datasets: [] });
	useEffect(() => {
		if (available_tokens && total_tokens)
			setPieData({
				labels: ['Available', 'Issued', 'Used', 'Redeemed'],
				datasets: [
					{
						data: [available_tokens, total_tokens, total_tokens - available_tokens, 11],
						backgroundColor: ['#2b7ec1', '#fd7e14', '#fc0345', '#03fc73'],
						hoverBackgroundColor: ['#2b7ec1', '#fd7e14', '#fc0345', '#03fc73']
					}
				]
			});
	}, [available_tokens, total_tokens]);

	return (
		<div>
			<Card>
				<CardBody>
					<Row>
						<Col>
							<CardTitle className="title">Balance</CardTitle>
						</Col>
						<Col>
							<button
								type="button"
								className="btn waves-effect waves-light btn-outline-info"
								style={{ borderRadius: '8px', float: 'right' }}
							>
								Activate
							</button>
						</Col>
					</Row>
					{fetching ? (
						<Loading />
					) : (
						<div className="chart-wrapper mb-5 mt-1 w-100" style={{ height: 350 }}>
							<Label className="mb-10">Tokens</Label>
							{pieData?.datasets.length > 0 && (
								<Pie
									data={pieData}
									options={{
										maintainAspectRatio: false,
										legend: {
											display: true,
											position: 'bottom',
											labels: {
												fontFamily: 'Be Vietnam',
												fontColor: '#9B9B9B'
											}
										}
									}}
								/>
							)}
						</div>
					)}
				</CardBody>
			</Card>
		</div>
	);
}
