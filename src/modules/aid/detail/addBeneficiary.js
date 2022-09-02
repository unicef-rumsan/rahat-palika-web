import React, { useState, useEffect, useCallback, useContext } from 'react';
import { Card, CardBody, Row, Col, Form, FormGroup, Label, Input, Button } from 'reactstrap';
import { useToasts } from 'react-toast-notifications';
import GrowSpinner from '../../../modules/global/GrowSpinner';
import { History } from '../../../utils/History';
import BreadCrumb from '../../ui_components/breadcrumb';
import { GROUPS, TOAST } from '../../../constants';
import { BeneficiaryContext } from '../../../contexts/BeneficiaryContext';
import UploadPlaceholder from '../../../assets/images/download.png';
import { blobToBase64 } from '../../../utils';
import BootstrapSwitchButton from 'bootstrap-switch-button-react';
import BankDetailForm from './bankDetailForm';
import { getProjectFromLS } from '../../../utils/checkProject';
import { getAidDetails } from '../../../services/aid';
const projectId = getProjectFromLS();

const AddBeneficiary = () => {
	const { addToast } = useToasts();
	const { addBeneficiary } = useContext(BeneficiaryContext);
	const [bankData, setBankData] = useState({});

	const [formData, setFormData] = useState({
		name: '',
		phone: '',
		email: '',
		address: '',
		projects: '',
		gender: '',
		govt_id: '',
		photo: '',
		govt_id_image: ''
	});

	const [extras, setExtras] = useState({
		age: '',
		education: '',
		profession: '',
		family_members: '',
		adult: '',
		child: ''
	});

	const handleBankData = (name, value) => {
		setBankData({ ...bankData, [name]: value });
	};

	const [loading, setLoading] = useState(false);
	const [projectDetails, setProjectDetails] = useState(null);

	const [selectedGender, setSelectedGender] = useState('');
	const [selectedGroup, setSelectedGroup] = useState('');

	const [profilePic, setProfilePic] = useState('');
	const [govtId, setGovtId] = useState('');

	const [bankFormView, setbankFormView] = useState(false);

	const handleProfileUpload = async e => {
		const file = e.target.files[0];
		const base64Url = await blobToBase64(file);
		setProfilePic(base64Url);
	};
	const handleGovtIdUpload = async e => {
		const file = e.target.files[0];
		const base64Url = await blobToBase64(file);
		setGovtId(base64Url);
	};

	const handleInputChange = e => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleExtraInfoChange = e => {
		setExtras({ ...extras, [e.target.name]: e.target.value });
	};

	const handleBankAccForm = checked => {
		setbankFormView(checked);
	};

	const handleFormSubmit = e => {
		e.preventDefault();
		if (selectedGroup) extras.group = selectedGroup;
		const payload = { ...formData, extras: { ...extras } };
		payload.bank_account = bankData;
		payload.projects = getProjectFromLS();
		if (selectedGender) payload.gender = selectedGender;
		if (profilePic) payload.photo = profilePic;
		if (govtId) payload.govt_id_image = govtId;
		setLoading(true);
		addBeneficiary(payload)
			.then(() => {
				setLoading(false);
				addToast('Beneficiary added successfully', TOAST.SUCCESS);
				History.push('/projects/current');
			})
			.catch(err => {
				setLoading(false);
				addToast(err.message, TOAST.ERROR);
			});
	};

	const handleGenderChange = e => setSelectedGender(e.target.value);

	const handleGroupChange = e => setSelectedGroup(e.target.value);

	const handleCancelClick = () => History.push('/projects/current');

	const fetchProjectDetails = useCallback(async () => {
		const projectDetails = await getAidDetails(projectId);
		setProjectDetails(projectDetails);
	}, []);

	useEffect(() => {
		fetchProjectDetails();
	}, [fetchProjectDetails]);

	return (
		<div>
			<p className="page-heading">Beneficiary</p>
			<BreadCrumb redirect_path="beneficiaries" root_label="Beneficiary" current_label="Add" />

			<Row>
				<Col md="12">
					<Card>
						<CardBody>
							<Form onSubmit={handleFormSubmit} style={{ color: '#6B6C72' }}>
								<Row>
									<Col md="6" sm="12" className="d-flex align-items-center">
										<FormGroup>
											<label htmlFor="profilePicUpload">Profile picture</label>
											<br />
											{profilePic ? (
												<img
													src={profilePic}
													alt="Profile"
													width="200px"
													height="200px"
													style={{ borderRadius: '10px', marginBottom: '10px' }}
												/>
											) : (
												<img src={UploadPlaceholder} alt="Profile" width="100px" height="100px" />
											)}
											<Input id="profilePicUpload" type="file" onChange={handleProfileUpload} />
										</FormGroup>
									</Col>
									<Col md="6" sm="12" className="d-flex align-items-center">
										<FormGroup>
											<label htmlFor="govtIdUpload">Government ID</label>
											<br />
											{govtId ? (
												<img
													src={govtId}
													alt="Govt ID"
													width="200px"
													height="200px"
													style={{ borderRadius: '10px', marginBottom: '10px' }}
												/>
											) : (
												<img src={UploadPlaceholder} alt="Govt ID" width="100px" height="100px" />
											)}
											<Input id="govtIdUpload" type="file" onChange={handleGovtIdUpload} />
										</FormGroup>
									</Col>
								</Row>
								<FormGroup>
									<Label>Project</Label>
									<Input type="text" name="project" value={projectDetails?.name || '-'} disabled />
								</FormGroup>

								<FormGroup>
									<Label>
										Name<span className="text-danger">*</span>
									</Label>
									<Input type="text" value={formData.name} name="name" onChange={handleInputChange} required />
								</FormGroup>
								<Row>
									<Col md="6" sm="12">
										<FormGroup>
											<Label>
												Phone<span className="text-danger">*</span>
											</Label>
											<Input type="number" value={formData.phone} name="phone" onChange={handleInputChange} required />
										</FormGroup>
									</Col>
									<Col md="6" sm="12">
										<FormGroup>
											<Label>Email</Label>
											<Input type="email" value={formData.email} name="email" onChange={handleInputChange} />
										</FormGroup>
									</Col>
								</Row>

								<Row>
									<Col md="6" sm="12">
										<FormGroup>
											<Label>Gender</Label>
											<Input type="select" name="gender" onChange={handleGenderChange}>
												<option value="">--Select Gender--</option>
												<option value="M">Male</option>
												<option value="F">Female</option>
												<option value="O">Other</option>
											</Input>
										</FormGroup>
									</Col>
									<Col md="6" sm="12">
										<FormGroup>
											<label htmlFor="age">Age</label>
											<br />
											<Input
												name="age"
												value={extras.age}
												type="number"
												className="form-field"
												onChange={handleExtraInfoChange}
											/>
										</FormGroup>
									</Col>
								</Row>

								<Row>
									<Col md="6" sm="12">
										<FormGroup>
											<Label>Permanent Address</Label>
											<Input type="text" value={formData.address} name="address" onChange={handleInputChange} />
										</FormGroup>
									</Col>
									<Col md="6" sm="12">
										{/* <FormGroup>
											<Label>Temporary Address</Label>
											<Input
												type="text"
												value={formData.address_temporary}
												name="address_temporary"
												onChange={handleInputChange}
											/>
										</FormGroup> */}
									</Col>
								</Row>

								<Row>
									<Col md="6" sm="12">
										<FormGroup>
											<Label>Education</Label>
											<Input type="text" value={extras.education} name="education" onChange={handleExtraInfoChange} />
										</FormGroup>
									</Col>
									<Col md="6" sm="12">
										<FormGroup>
											<label htmlFor="profession">Profession</label>
											<br />
											<Input
												name="profession"
												value={extras.profession}
												type="text"
												className="form-field"
												onChange={handleExtraInfoChange}
											/>
										</FormGroup>
									</Col>
								</Row>

								<Row>
									<Col md="6" sm="12">
										<FormGroup>
											<label htmlFor="govt_id" value={formData.govt_id}>
												Government ID number
											</label>
											<br />
											<Input
												name="govt_id"
												value={formData.govt_id}
												type="number"
												className="form-field"
												onChange={handleInputChange}
											/>
										</FormGroup>
									</Col>
									<Col md="6" sm="12">
										<FormGroup>
											<Label>Group</Label>
											<Input type="select" name="group" onChange={handleGroupChange}>
												<option value="">--Select Group--</option>
												<option value={GROUPS.DIFFERENTLY_ABLED.value}>{GROUPS.DIFFERENTLY_ABLED.label}</option>
												<option value={GROUPS.MATERNITY.value}>{GROUPS.MATERNITY.label}</option>
												<option value={GROUPS.SENIOR_CITIZENS.value}>{GROUPS.SENIOR_CITIZENS.label}</option>
												<option value={GROUPS.COVID_VICTIM.value}>{GROUPS.COVID_VICTIM.label}</option>
												<option value={GROUPS.NATURAL_CLIMATE_VICTIM.value}>
													{GROUPS.NATURAL_CLIMATE_VICTIM.label}
												</option>
												<option value={GROUPS.UNDER_PRIVILAGED.value}>{GROUPS.UNDER_PRIVILAGED.label}</option>
												<option value={GROUPS.SEVERE_HEATH_ISSUES.value}>{GROUPS.SEVERE_HEATH_ISSUES.label}</option>
												<option value={GROUPS.SINGLE_WOMAN.value}>{GROUPS.SINGLE_WOMAN.label}</option>
												<option value={GROUPS.ORPHAN.value}>{GROUPS.ORPHAN.label}</option>
											</Input>
										</FormGroup>
									</Col>
								</Row>

								<FormGroup>
									<label htmlFor="family_members">Number of family members</label>
									<br />
									<Input
										name="family_members"
										value={extras.family_members}
										type="number"
										className="form-field"
										onChange={handleExtraInfoChange}
									/>
								</FormGroup>
								<Row>
									<Col md="6" sm="12">
										<FormGroup>
											<Label>Adult</Label>
											<Input type="number" value={extras.adult} name="adult" onChange={handleExtraInfoChange} />
										</FormGroup>
									</Col>
									<Col md="6" sm="12">
										<FormGroup>
											<Label>Child</Label>
											<Input type="number" value={extras.child} name="child" onChange={handleExtraInfoChange} />
										</FormGroup>
									</Col>
								</Row>
							</Form>
						</CardBody>
					</Card>
				</Col>
			</Row>

			<Row>
				<Col md="12">
					<Card>
						<CardBody>
							<Form onSubmit={handleFormSubmit} style={{ color: '#6B6C72' }}>
								<Row>
									<Col>
										<FormGroup>
											<Label className="mr-3">Do you have bank account ? </Label>
											<BootstrapSwitchButton
												checked={bankFormView}
												onlabel="Banked"
												offlabel="Unbanked"
												width={120}
												height={20}
												onstyle="success"
												onChange={handleBankAccForm}
											/>
										</FormGroup>
									</Col>
								</Row>
								{bankFormView && <BankDetailForm bankData={bankData} handleBankData={handleBankData} />}
								<CardBody style={{ paddingLeft: 0 }}>
									{loading ? (
										<GrowSpinner />
									) : (
										<div>
											<Button type="submit" className="btn btn-info" onClick={handleFormSubmit}>
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

export default AddBeneficiary;
