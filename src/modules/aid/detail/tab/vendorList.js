import React, { useContext, useEffect, useCallback, useState } from 'react';
import { Col, Row, Table, CustomInput, Input } from 'reactstrap';
import { Link } from 'react-router-dom';

import { AidContext } from '../../../../contexts/AidContext';
import { AppContext } from '../../../../contexts/AppSettingsContext';
import { VendorContext } from '../../../../contexts/VendorContext';
import AdvancePagination from '../../../global/AdvancePagination';
import { APP_CONSTANTS } from '../../../../constants';
import { getUser } from '../../../../utils/sessionManager';
import { getTitleCase } from '../../../../utils';
import moment from 'moment';
const { PAGE_LIMIT } = APP_CONSTANTS;

const List = ({ projectId }) => {
	const { appSettings } = useContext(AppContext);
	const { getVendorsBalances } = useContext(VendorContext);
	const { agency: userAgency } = getUser();
	const { vendors_list, vendorsByAid } = useContext(AidContext);
	const [vendors, setVendors] = useState([]);
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

	const fetchVendorBalances = useCallback(async () => {
		if (!appSettings || !appSettings.agency || !appSettings.agency.contracts) return;
		const balances = await getVendorsBalances({ data: vendors_list });
		const updatedVendors = vendors_list.map((vendor, i) => ({ ...vendor, balance: balances[i] }));
		setVendors([...updatedVendors]);
	}, [appSettings, getVendorsBalances, vendors_list]);

	const fetchTotalRecords = useCallback(async () => {
		const data = await vendorsByAid(projectId);
		setTotalRecords(data.total);
	}, [vendorsByAid, projectId]);

	useEffect(() => {
		fetchTotalRecords();
	}, [fetchTotalRecords]);

	useEffect(() => {
		fetchVendorBalances();
	}, [fetchVendorBalances]);
	return (
		<>
			<Row>
				<Col>
					<div className="input-group" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end' }}>
						<div style={{ flex: 1 }}></div>
						<CustomInput
							type="select"
							id="exampleCustomSelect"
							name="customSelect"
							defaultValue=""
							className="m-2"
							style={{ maxWidth: '150px' }}
						>
							<option value="phone">Filter By</option>
							<option value="name">Name</option>
							<option value="phoneNumber">Phone Number</option>
							<option value="banked-unbanked">Banked / Unbanked</option>
							<option value="gender">Gender</option>
						</CustomInput>
						<Input placeholder="Search Here ..." className="m-2" style={{ maxWidth: '250px' }} />
					</div>
				</Col>
			</Row>
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
						{/* <th className="border-0">Action</th> */}
					</tr>
				</thead>
				<tbody>
					{vendors && vendors.length > 0 ? (
						vendors.map((d, i) => {
							return (
								<tr key={d._id}>
									<td>{(currentPage - 1) * PAGE_LIMIT + i + 1}</td>
									<td>
										<Link style={{ color: '#2b7ec1' }} to={`/vendors/${d._id}`}>
											{d.name}
										</Link>
									</td>
									<td>{getTitleCase(d.agencies.find(agency => agency.agency === userAgency).status)}</td>
									<td>{d.phone || '-'}</td>
									<td>{d.address || '-'}</td>
									<td>{moment(d.created_at).format('ll') || '-'}</td>
									<td>{d.balance}</td>
									{/* <td>{d.action || '-'}</td> */}
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
