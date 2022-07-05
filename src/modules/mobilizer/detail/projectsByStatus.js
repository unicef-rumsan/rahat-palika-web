import React from 'react';
import { Card, CardTitle, Table, Button } from 'reactstrap';
import { MOBIZ_STATUS } from '../../../constants';

import '../../../assets/css/project.css';

export default function PrejctsByStatus({ mobilizerProjects, handleApproveReject }) {
	function renderStatus(status) {
		if (status === MOBIZ_STATUS.ACTIVE) return 'Active';
		if (status === MOBIZ_STATUS.SUSPENDED) return 'Suspended';
		else return 'New';
	}

	return (
		<div>
			<Card>
				<div className="stat-card-body" style={{ minHeight: 120 }}>
					<CardTitle className="title" style={{ flexBasis: '90%' }}>
						Projects Involved
					</CardTitle>

					<Table className="no-wrap v-middle" responsive>
						<thead>
							<tr className="border-0">
								<th className="border-0">Project</th>
								<th className="border-0">Status</th>
							</tr>
						</thead>
						<tbody>
							{mobilizerProjects && mobilizerProjects.length ? (
								mobilizerProjects.map((p, index) => {
									return (
										<tr key={index}>
											<td>{p.project.name || ''}</td>
											<td>{renderStatus(p.status) || '-'}</td>
										</tr>
									);
								})
							) : (
								<tr>
									<td colSpan={2}>No projects available.</td>
								</tr>
							)}
						</tbody>
					</Table>
				</div>
			</Card>
		</div>
	);
}
