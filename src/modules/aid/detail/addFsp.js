import React, { useState, useContext } from 'react';
import { Card, CardBody, Row, Col, Form, FormGroup, Label, Input, Button } from 'reactstrap';
import { useToasts } from 'react-toast-notifications';
import { AppContext } from '../../../contexts/AppSettingsContext';
import { History } from '../../../utils/History';
import FspSelector from '../../global/FspSelector';
import GrowSpinner from '../../../modules/global/GrowSpinner';
import BreadCrumb from '../../ui_components/breadcrumb';
import { addFsp } from '../../../services/fsp';
import { getProjectFromLS } from '../../../utils/checkProject';

const AddFsp = params => {
	const { loading } = useContext(AppContext);
	const [selectorFsp] = useState('');
	const { addToast } = useToasts();
	const [formData, setFormData] = useState({
		name: '',
		bisCode: '',
		email: '',
		phone: '',
		address: ''
	});
	const handleInputChange = e => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleFormSubmit = async e => {
		e.preventDefault();
		const projectId = getProjectFromLS();
		console.log({ projectId });
		try {
			const response = await addFsp(projectId, formData);
			if (response.status === 200) {
				addToast('Fsp Added Successfully', { appearance: 'success', autoDismiss: true });
				History.push('/current/projects');
			}
		} catch (error) {
			console.log(error);
		}
	};

	const handleCancelClick = () => History.push('/projects');
	const matchFsp = data => {
		console.log({ formData });
		const { name, bisCode, address, email, phone } = data;
		const bankValue = {
			name,
			bisCode: bisCode,
			email: email,
			address,
			phone: phone
		};
		setFormData(bankValue);
	};

	return (
		<div style={{ marginTop: '100px' }}>
			<p className="page-heading">FSP</p>
			<BreadCrumb redirect_path="fsp" root_label="FSP" current_label="Add" />

			<Row>
				<Col md="12">
					<Card>
						<CardBody>
							<Form onSubmit={handleFormSubmit} style={{ color: '#6B6C72' }}>
								<Row>
									<Col lg={4} md={12}>
										<FormGroup>
											<Label>Swift Code</Label>
											<Input
												readOnly
												type="text"
												name="bisCode"
												onChange={handleInputChange}
												defaultValue={formData.bisCode}
												required
											/>
										</FormGroup>
									</Col>
									<Col lg={4} md={12}>
										<FormGroup>
											<Label>Contact Email</Label>
											<Input
												name="email"
												onChange={handleInputChange}
												defaultValue={formData.email}
												type="text"
												required
											/>
										</FormGroup>
									</Col>
									<Col lg={4} md={12}>
										<FormGroup>
											<Label>Contact Phone</Label>
											<Input
												name="phone"
												onChange={handleInputChange}
												defaultValue={formData.phone}
												type="text"
												required
											/>
										</FormGroup>
									</Col>
								</Row>
								<Row>
									<Col lg={6} md={12}>
										<FormGroup>
											<Label>Bank Name</Label>
											<FspSelector
												fsp={selectorFsp}
												onChange={e => {
													matchFsp(e);
												}}
												label={false}
											/>
										</FormGroup>
									</Col>
									<Col lg={6} md={12} style={{ marginTop: '0.1rem' }}>
										<FormGroup>
											<Label>Contact Name</Label>
											<Input name="contact_name" type="text" required />
										</FormGroup>
									</Col>
								</Row>

								<CardBody style={{ paddingLeft: 0 }}>
									{loading ? (
										<GrowSpinner />
									) : (
										<div>
											<Button type="submit" className="btn btn-info">
												<i className="fa fa-check"></i> Submit
											</Button>
											<Button
												type="button"
												onClick={handleCancelClick}
												style={{ borderRadius: 8 }}
												className="btn btn-dark ml-2"
											>
												Cancel
											</Button>
										</div>
									)}
								</CardBody>
							</Form>
						</CardBody>
					</Card>
				</Col>
			</Row>
		</div>
	);
};

export default AddFsp;
