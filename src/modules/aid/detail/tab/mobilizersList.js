import React, { useContext, useEffect, useCallback, useState } from 'react';
import { Table, CustomInput, Input } from 'reactstrap';
import { Link } from 'react-router-dom';

import { AidContext } from '../../../../contexts/AidContext';
import AdvancePagination from '../../../global/AdvancePagination';
import { APP_CONSTANTS } from '../../../../constants';

const { PAGE_LIMIT } = APP_CONSTANTS;

const List = ({ projectId }) => {
	const { listMobilizersByProject } = useContext(AidContext);
	const [totalRecords, setTotalRecords] = useState(null);
	const [currentPage, setCurrentPage] = useState(1);
	const [mobilizers, setMobilizers] = useState([]);

	const onPageChanged = useCallback(
		async paginationData => {
			const { currentPage, pageLimit } = paginationData;
			setCurrentPage(currentPage);
			let start = (currentPage - 1) * pageLimit;
			const query = { start, limit: PAGE_LIMIT, projectId };
			const res = await listMobilizersByProject(query);
			if (res) setMobilizers(res.data);
		},
		[projectId, listMobilizersByProject]
	);

	const fetchTotalRecords = useCallback(async () => {
		const data = await listMobilizersByProject({ projectId });
		setTotalRecords(data.total);
	}, [listMobilizersByProject, projectId]);

	useEffect(() => {
		fetchTotalRecords();
	}, [fetchTotalRecords]);

	return (
		<>
		<div>
				<div className="row">
					<div style={{ flex: 1}}>
					</div>
					<CustomInput
						type="select"
						id="exampleCustomSelect"
						name="customSelect"
						defaultValue=""
						style={{ marginRight: '5px',width:'12%' }}
					>
						<option value="phone">Filter By</option>
						<option value="name">Name</option>
						<option value="phoneNumber">Phone Number</option>
						<option value="banked-unbanked">Banked / Unbanked</option>
						<option value="gender">Gender</option>
					</CustomInput>
					<Input
						placeholder='Search Here ...'
						style={{ marginRight: '5px',width:'12%' }}
					/>
				</div>
				<div className="flex-item">
					{/* <button type="button" className="btn waves-effect waves-light btn-info" style={{ borderRadius: '8px' }}>
						Add Beneficiary
					</button> */}
				</div>
			</div>
			<Table className="no-wrap v-middle" responsive>
				<thead>
					<tr className="border-0">
						<th className="border-0">S.N.</th>
						<th className="border-0">Name</th>
						<th className="border-0">Address</th>
						<th className="border-0">Phone number</th>
						<th className="border-0">Email</th>
					</tr>
				</thead>
				<tbody>
					{mobilizers.length > 0 ? (
						mobilizers.map((d, i) => {
							return (
								<tr key={d._id}>
									<td>{(currentPage - 1) * PAGE_LIMIT + i + 1}</td>
									<td>
										<Link style={{ color: '#2b7ec1' }} to={`/mobilizers/${d._id}`}>
											{d.name}
										</Link>
									</td>
									<td>{d.address || '-'}</td>
									<td>{d.phone || '-'}</td>
									<td>{d.email || '-'}</td>
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

			{totalRecords > 0 && (
				<AdvancePagination
					totalRecords={totalRecords}
					pageLimit={PAGE_LIMIT}
					pageNeighbours={1}
					onPageChanged={onPageChanged}
				/>
			)}
		</>
	);
};

export default List;
