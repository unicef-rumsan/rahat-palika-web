import React, { useContext, useEffect, useCallback, useState } from 'react';
import { Table, CustomInput, Input } from 'reactstrap';
import { Link } from 'react-router-dom';

import { AidContext } from '../../../../contexts/AidContext';
import AdvancePagination from '../../../global/AdvancePagination';
import { APP_CONSTANTS } from '../../../../constants';

const { PAGE_LIMIT } = APP_CONSTANTS;

const List = ({ projectId }) => {
	const { vendors_list, vendorsByAid } = useContext(AidContext);
	const [totalRecords, setTotalRecords] = useState(null);
	const [currentPage, setCurrentPage] = useState(1);

	const onPageChanged = useCallback(
		async paginationData => {
			const { currentPage, pageLimit } = paginationData;
			setCurrentPage(currentPage);
			let start = (currentPage - 1) * pageLimit;
			const query = { start, limit: PAGE_LIMIT };
			await vendorsByAid(projectId, query);
		},
		[vendorsByAid, projectId]
	);

	const fetchTotalRecords = useCallback(async () => {
		const data = await vendorsByAid(projectId);
		setTotalRecords(data.total);
	}, [vendorsByAid, projectId]);

	useEffect(() => {
		fetchTotalRecords();
	}, [fetchTotalRecords]);

	return (
		<>
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
			<Table className="no-wrap v-middle" responsive>
				<thead>
					<tr className="border-0">
						<th className="border-0">S.N.</th>
						<th className="border-0">Name</th>
						<th className="border-0">Status</th>
						<th className="border-0">Phone</th>
						<th className="border-0">Address</th>
						<th className="border-0">Registration Date</th>
						<th className="border-0">Balance</th>
						<th className="border-0">Action</th>
					</tr>
				</thead>
				<tbody>
					{vendors_list.length > 0 ? (
						vendors_list.map((d, i) => {
							return (
								<tr key={d._id}>
									<td>{(currentPage - 1) * PAGE_LIMIT + i + 1}</td>
									<td>
										<Link style={{ color: '#2b7ec1' }} to={`/vendors/${d._id}`}>
											{d.name}
										</Link>
									</td>
									<td>{d.status || '-'}</td>
									<td>{d.phone || '-'}</td>
									<td>{d.address || '-'}</td>
									<td>{d.registration_date}</td>
									<td>{d.balance}</td>
									<td>{d.action || '-'}</td>
								</tr>
							);
						})
					) : (
						<tr>
							<td colSpan={4}></td>
							<td>No data available.</td>
							<td colSpan={4}></td>
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
