import React, { useContext, useEffect, useState, useCallback } from 'react';
import { useToasts } from 'react-toast-notifications';
import Select from 'react-select';
import { useHistory } from 'react-router-dom';

import {
	Card,
	CardBody,
	Row,
	Col,
	Button,
	Table,
	CustomInput,
	Input,
	CardTitle,
	Label,
	FormGroup,
	Modal,
	ModalBody,
	ModalHeader,
	ModalFooter
} from 'reactstrap';
import BreadCrumb from '../../ui_components/breadcrumb';
import  {Link}  from 'react-router-dom';
import Balance from '../../ui_components/balance';

export default function DetailsForm(props) {
	let history = useHistory();

	return (
		<>
			<p className="page-heading">Financial Service Provider</p>
			<BreadCrumb redirect_path="mobilizers" root_label="Mobilizers" current_label="Details" />
			<Modal>
				<ModalHeader>Select Project</ModalHeader>
				<ModalBody>
					<FormGroup>
						<Label>Project *</Label>
						<Select
							closeMenuOnSelect={true}
							defaultValue={[]}
							placeholder="--Select Project--"
						/>
						<br />
					</FormGroup>
				</ModalBody>
				<ModalFooter>
					<React.Fragment>
						<Button type="button" color="primary">
							Submit
						</Button>
						<Button color="secondary">
							Cancel
						</Button>
					</React.Fragment>
				</ModalFooter>
			</Modal>
			<div className='mb-3 ml-2'>
				<Button className="btn" onClick={() => history.goBack()}>Go Back</Button >
			</div>	
			<Row>
				<Col md="7">

					<Card>
						<div className="stat-card-body" style={{ minHeight: 120 }}>
							<CardTitle className="title" style={{ flexBasis: '70%' }}>
								Financial Service Provider Details
							</CardTitle>

							<Row>
								<Col md="12" sm="8" style={{ marginBottom: '10px' }}>
									<div style={{ display: 'flex', alignItems: 'center',justifyContent:'space-around' }}>
										<img
											src={'https://assets.rumsan.com/esatya/nabil-bank-logo.png'}
											alt="user"
											className="rounded-circle"
											width="45"
											height="45"
										/>
										<div style={{ marginLeft: '20px' }}>
											<p className="card-font-medium">Nabil Bank Limited</p>
											<div className="sub-title">Name</div>
										</div>
										<div style={{ marginLeft: '20px' }}>
											<p className="card-font-medium">Sanepa</p>
											<div className="sub-title">Branch</div>
										</div>
									</div>
								</Col>
							</Row>
						</div>
					</Card>
				</Col>
				<Col md="5">
					<Balance
						action=""
						title="Beneficiaries"
						button_name=""
						handleIssueToken=""
					/>
				</Col>
			</Row>
			<Row>
				<Col md='12'>
				<Card>
					<div className="stat-card-body" style={{ minHeight: 120 }}>
						<div style={{ display: 'flex', justifyContent: 'space-between' }}>
							<CardTitle className="title" style={{ flexBasis: '90%' }}>
								More Information
							</CardTitle>
							<div style={{ flexBasis: '10%' }}>
								<button
									type="button"
									className="btn waves-effect waves-light btn-info"
									style={{ borderRadius: '8px' }}
								>
									Edit
								</button>
							</div>
						</div>
						<Row>
							<Col md="4" sm="12">
							<div className="card-data">
									<p className="card-font-medium">Flood Distribution</p>
									<div className="sub-title">Project Name</div>
								</div>
								<div className="card-data">
									<p className="card-font-medium">bank@nabil.com</p>
									<div className="sub-title">Email</div>
								</div>
								
								<div className="card-data">
									<p className="card-font-medium">Lalitpur Palika</p>
									<div className="sub-title">Agency/Palika Name</div>
								</div>
							</Col>
							<Col md="4" sm="12">
								<div className="card-data">
									<p className="card-font-medium">009333888388333</p>
									<div className="sub-title">Project Account Number</div>
								</div>
								<div className="card-data">
									<p className="card-font-medium">01-332332</p>
									<div className="sub-title">Phone Number</div>
								</div>
							</Col>
							<Col md="4" sm="12">
								<div className="card-data ">
									<p className="card-font-medium">18-07-2022</p>
								<div className="sub-title">Registration Date</div>
								</div>
							</Col>
						</Row>
					</div>
				</Card>
				</Col>
			</Row>
			<Row>
				<Col md="12">
					<Card>
						<CardBody>
						<CardTitle className="mb-0 p-3">
						<Row>
							  <Col md="6">Beneficiary Details</Col>
							  <Col md="6">
									<div
										style={{
											float: 'right',
											display: 'flex'
										}}
									>
										<CustomInput
											type="select"
											id="exampleCustomSelect"
											name="customSelect"
											defaultValue=""
											style={{ width: 'auto', marginRight: '5px' }}
										>
											<option value="phone">Filter By</option>
											<option value="name">Status</option>
										</CustomInput>
									</div>
							  </Col>
						</Row>
					</CardTitle>
							<Table className="no-wrap v-middle" responsive>
								<thead>
									<tr className="border-0">
										<th className="border-0">Beneficiary Name</th>
										<th className="border-0">Account Number</th>
										<th className="border-0">Amount (Rs)</th>
										<th className="border-0">Transfer Date</th>
										<th className="border-0">Status</th>
									</tr>
								</thead>
								<tbody>
							
										<tr>
											<td colSpan={5}>No data available.</td>
										</tr>
								</tbody>
							</Table>
						</CardBody>
					</Card>
				</Col>
			</Row>
		</>
	);
}
