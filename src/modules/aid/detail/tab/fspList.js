import React, { useState, useEffect, useCallback } from 'react';
import { Table } from 'reactstrap';
import { Link } from 'react-router-dom';
import { listProjectFsp } from '../../../../services/fsp';
import { getTitleCase } from '../../../../utils';

const List = ({ projectId }) => {
	const [projectFsp, setProjectFsp] = useState([]);

	const fetchProjectFsp = useCallback(async () => {
		const { data: fsps } = await listProjectFsp(projectId);
		setProjectFsp(fsps);
	}, [projectId]);

	useEffect(() => {
		fetchProjectFsp();
	}, [fetchProjectFsp]);

	return (
		<>
			<div>
				<div className="row">
					<div style={{ flex: 1, padding: 10 }}></div>
					<div style={{ padding: 10, float: 'right' }}>
						<input type="text" placeholder="Search ..." className="custom-input-box-2" style={{ marginRight: '8px' }} />
						<button
							type="button"
							className="btn waves-effect waves-light btn-outline-info"
							style={{ borderRadius: '8px', marginRight: '20px' }}
						>
							<Link to={`/projects/addFsp`}>Add FSP</Link>
						</button>
					</div>
				</div>
			</div>
			<Table className="no-wrap v-middle" responsive>
				<thead>
					<tr className="border-0">
						<th className="border-0">S.N.</th>
						<th className="border-0">Name</th>
						<th className="border-0">Account Number</th>
						<th className="border-0">Swift Code</th>
						<th className="border-0">Address</th>
						<th className="border-0">Phone</th>
						<th className="border-0">View</th>
					</tr>
				</thead>
				<tbody>
					{projectFsp.length > 0 ? (
						projectFsp.map((d, i) => {
							return (
								<tr key={d._id}>
									<td>{i + 1}</td>
									<td>{getTitleCase(d.name) || '-'}</td>
									<td>{d.account_number || '-'}</td>
									<td>{d.bisCode || '-'}</td>
									<td>{getTitleCase(d.address) || '-'}</td>
									<td>{d.phone}</td>
									<td className="blue-grey-text  text-darken-4 font-medium">
										<Link to={`/projects/fspDetail`}>
											<i className="fas fa-eye fa-lg"></i>
										</Link>
									</td>
								</tr>
							);
						})
					) : (
						<tr>
							<td colSpan={3}></td>
							<td>No data available.</td>
							<td colSpan={2}></td>
						</tr>
					)}
				</tbody>
			</Table>
		</>
	);
};

export default List;
