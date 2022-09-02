import React, { useRef, useState } from 'react';
import moment from 'moment';
import { Card, CardTitle, Col, Row, FormGroup, Input, Label } from 'reactstrap';

import '../../../assets/css/project.css';
import QRGenerator from './qrGenerator';
import ReactToPrint from 'react-to-print';
import ModalWrapper from '../../global/CustomModal';
import { MAX_QR_GEN } from '../../../constants';

export default function ProjectInfo({ projectDetails }) {
	const { project_manager, location, description, serial_index, status, start_date, end_date } = projectDetails;

	const [qrGenModal, setQrGenModal] = useState(false);
	const [qrGenData, setQrGenData] = useState({ min: 0, max: 0, projectVersion: 0, amount: null });

	const toggleQrGen = () => {
		setQrGenModal(!qrGenModal);
		setQrGenData({ min: 0, max: 0, projectVersion: serial_index, amount: null });
	};

	const qrComponentRef = useRef();
	const printRef = useRef();
	const handleQrGenSubmit = e => {
		e.preventDefault();
		printRef.current.handleClick();
	};

	const handleQrGenData = e => {
		if (e.target.name === 'max' && e.target.value > MAX_QR_GEN) return;

		setQrGenData({ ...qrGenData, [e.target.name]: e.target.value || null });
	};

	return (
		<div>
			<div style={{ display: 'none' }}>
				<QRGenerator props={qrGenData} ref={qrComponentRef} />
				<ReactToPrint trigger={() => <React.Fragment />} content={() => qrComponentRef.current} ref={printRef} />
			</div>
			<ModalWrapper
				toggle={toggleQrGen}
				open={qrGenModal}
				title="Pre-Generate Qr-Code"
				handleSubmit={handleQrGenSubmit}
			>
				<FormGroup>
					<Label>Number of Qr-code</Label>
					<Input
						type="number"
						name="max"
						placeholder="please enter no. between 0 - 1000"
						value={qrGenData.max || ''}
						onChange={handleQrGenData}
						min={1}
						max={MAX_QR_GEN}
						required
					/>
				</FormGroup>
				<FormGroup>
					<Label>Token Amount</Label>
					<Input
						type="number"
						name="amount"
						placeholder="please enter token amount for qr-code"
						value={qrGenData.amount || ''}
						onChange={handleQrGenData}
					/>
				</FormGroup>
			</ModalWrapper>
			<Card>
				<div className="stat-card-body" style={{ minHeight: 310 }}>
					<Row className="mb-3">
						<Col>
							<CardTitle className="title" style={{ flexBasis: '90%' }}>
								More Information
							</CardTitle>
						</Col>
						<Col>
							{/* <div style={{ flex: 1, padding: 2, float: 'right' }}>
								<button
									onClick={toggleQrGen}
									type="button"
									className="btn waves-effect waves-light btn-outline-info"
									style={{ borderRadius: '8px' }}
								>
									Pre-Generate Qr code
								</button>
							</div> */}
						</Col>
					</Row>
					<Row>
						<Col md="6" sm="12">
							<div style={{ marginBottom: '25px' }}>
								<p className="card-font-medium">
									{project_manager ? `${project_manager.name.first} ${project_manager.name.last}` : '-'}
								</p>
								<div className="sub-title">Project Manager</div>
							</div>
							<div style={{ marginBottom: '25px' }}>
								<p className="card-font-medium">{location || '-'}</p>
								<div className="sub-title">Location</div>
							</div>
						</Col>
						<Col md="4" sm="12">
							<div style={{ marginBottom: '25px' }}>
								<p className="card-font-medium">{start_date ? moment(start_date).format('ll') : '-'}</p>
								<div className="sub-title">Start Date</div>
							</div>
							<div style={{ marginBottom: '25px' }}>
								<p className="card-font-medium">{end_date ? moment(end_date).format('ll') : '-'}</p>
								<div className="sub-title">End Date</div>
							</div>
						</Col>
						<Col md="2" sm="12">
							<div style={{ marginBottom: '25px' }}>
								<p className={`card-font-medium text-${status === 'active' ? 'success' : 'danger'}`}>
									{status ? status.toUpperCase() : '-'}
								</p>
								<div className="sub-title">Status</div>
							</div>
						</Col>
					</Row>

					<p className="sub-title" style={{ textAlign: 'justify' }}>
						{description || ''}
					</p>
				</div>
			</Card>
		</div>
	);
}
