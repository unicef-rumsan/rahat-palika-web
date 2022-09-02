import React, { useContext, useState, useEffect, useCallback } from 'react';
import { Col, Row, Table, FormGroup, InputGroup, Input, CustomInput } from 'reactstrap';
import { useToasts } from 'react-toast-notifications';
import QRCode from 'qrcode';
import * as XLSX from 'xlsx';
import { Link } from 'react-router-dom';

import { AidContext } from '../../../../contexts/AidContext';
import { AppContext } from '../../../../contexts/AppSettingsContext';
import { BeneficiaryContext } from '../../../../contexts/BeneficiaryContext';
import { APP_CONSTANTS, TOAST } from '../../../../constants';
import { htmlResponse } from '../../../../utils/printBeneficiary';
import ModalWrapper from '../../../global/CustomModal';
import UploadList from './uploadList';
import AdvancePagination from '../../../global/AdvancePagination';
import MaskLoader from '../../../global/MaskLoader';
import MiniSpinner from '../../../global/MiniSpinner';

const { PAGE_LIMIT, BULK_BENEFICIARY_LIMIT } = APP_CONSTANTS;

const ACTION = {
	BULK_QR: 'bulk_qrcode_export',
	BULK_ISSUE: 'bulk_token_issue'
};

const List = ({ projectId }) => {
	const { addToast } = useToasts();
	const { beneficiaryByAid, bulkTokenIssueToBeneficiary, uploadBenfToProject } = useContext(AidContext);
	const { loading, setLoading, palikaWallet: wallet, appSettings } = useContext(AppContext);
	const { getBeneficiariesBalances } = useContext(BeneficiaryContext);

	const [benList, setBenList] = useState([]);

	const [amount, setAmount] = useState('');
	const [amountModal, setAmountModal] = useState(false);

	const [uploadListModal, setUploadListModal] = useState(false);
	const [previewData, setUploadPreview] = useState(null);
	const [benfUploadFile, setBenfUploadFile] = useState(null);
	const [uploading, setUploading] = useState(false);

	const [totalRecords, setTotalRecords] = useState(null);
	const [currentAction, setCurrentAction] = useState('');
	const [currentPage, setCurrentPage] = useState(1);
	const [fetchingBeneficiaryTokens, setfetchingBeneficiaryTokens] = useState(true);

	const hiddenFileInput = React.useRef(null);

	const toggleUploadListModal = () => setUploadListModal(!uploadListModal);

	const toggleAmountModal = useCallback(
		action => {
			if (action) setCurrentAction(action);
			setAmountModal(!amountModal);
		},
		[amountModal]
	);
	const handleFileUploadClick = event => {
		hiddenFileInput.current.click();
	};

	const appendBeneficiaryBalances = useCallback(({ beneficiaries, balances }) => {
		const beneficiariesWithTokens = beneficiaries.map((ben, i) => {
			ben.tokenBalance = balances[i];
			return ben;
		});
		setBenList(beneficiariesWithTokens);
		setfetchingBeneficiaryTokens(false);
	}, []);

	const fetchBeneficiariesBalances = useCallback(
		async ({ beneficiaries, timeOut }) => {
			if (!appSettings || !appSettings.agency || !appSettings.agency.contracts) return;
			const { agency } = appSettings;
			setfetchingBeneficiaryTokens(true);
			if (timeOut) {
				setTimeout(async () => {
					const balances = await getBeneficiariesBalances(beneficiaries, agency.contracts.rahat);
					if (balances.length) appendBeneficiaryBalances({ beneficiaries, balances });
				}, timeOut);
			} else {
				const balances = await getBeneficiariesBalances(beneficiaries, agency.contracts.rahat);
				if (balances.length) await appendBeneficiaryBalances({ beneficiaries, balances });
			}
		},
		[appSettings, getBeneficiariesBalances, appendBeneficiaryBalances]
	);

	const handleUploadListSubmit = async e => {
		e.preventDefault();
		if (!benfUploadFile) return addToast('Please select excel file to upload', TOAST.ERROR);
		try {
			setUploading(true);
			const form_data = new FormData();
			form_data.append('file', benfUploadFile);
			const res = await uploadBenfToProject(projectId, form_data);
			setUploading(false);
			toggleUploadListModal();
			addToast(`${res.uploaded_beneficiaries} beneficiaries uploaded successfully`, TOAST.SUCCESS);
			fetchTotalRecords();
		} catch (err) {
			setUploading(false);
			toggleUploadListModal();
			const errMsg = err && err.message ? err.message : 'Internal server error';
			addToast(errMsg, TOAST.ERROR);
		}
	};

	const handleFileChange = e => {
		setUploadListModal(true);
		const file = e.target.files[0];
		readFile(file);
		e.target.value = '';
		setBenfUploadFile(file);
	};

	const readFile = file => {
		const reader = new FileReader();
		reader.onload = evt => {
			// evt = on_file_select event
			/* Parse data */
			const bstr = evt.target.result;
			const wb = XLSX.read(bstr, { type: 'binary' });
			/* Get first worksheet */
			const wsname = wb.SheetNames[0];
			const ws = wb.Sheets[wsname];
			/* Convert array of arrays */
			const data = XLSX.utils.sheet_to_csv(ws, { header: 1 });
			/* Update state */
			const jsonData = convertToJson(data);
			setUploadPreview(jsonData);
		};
		reader.readAsBinaryString(file);
	};

	const convertToJson = csv => {
		let result = [];
		let lines = csv.split('\n');
		let headers = lines[0].split(',');

		for (let i = 1; i < lines.length; i++) {
			let obj = {};
			let currentline = lines[i].split(',');

			for (let j = 0; j < headers.length; j++) {
				obj[headers[j].toLowerCase()] = currentline[j];
			}
			result.push(obj);
		}
		return result; //JSON
	};

	const handleAmountChange = e => setAmount(e.target.value);

	const handleModalFormSubmit = e => {
		e.preventDefault();
		if (currentAction === ACTION.BULK_QR) return handleBulkQrExport();
		if (currentAction === ACTION.BULK_ISSUE) return handleBulkTokenIssue();
	};

	const onPageChanged = useCallback(
		async paginationData => {
			const { currentPage, pageLimit } = paginationData;
			setCurrentPage(currentPage);
			let start = (currentPage - 1) * pageLimit;
			const query = { start, limit: PAGE_LIMIT };
			const data = await beneficiaryByAid(projectId, query);
			setBenList(data.data);
			fetchBeneficiariesBalances({ beneficiaries: data.data });
		},
		[beneficiaryByAid, projectId, fetchBeneficiariesBalances]
	);

	const convertQrToImg = async data => {
		let result = [];
		for (let d of data) {
			const imgUrl = await QRCode.toDataURL(`phone:+977${d.phone}?amount=${amount ? amount : null}`);
			result.push({ imgUrl, phone: d.phone });
		}
		return result;
	};

	const submitBulkTokenIssue = useCallback(
		async ({ beneficiaryPhones, beneficiaryTokens, beneficiaries }) => {
			if (wallet) {
				try {
					setLoading(true);
					const { contracts } = appSettings.agency;
					let res = await bulkTokenIssueToBeneficiary({
						projectId: projectId,
						phone_numbers: beneficiaryPhones,
						token_amounts: beneficiaryTokens,
						contract_address: contracts.rahat,
						wallet
					});
					if (res) {
						setAmount('');
						const total_ben = beneficiaryPhones.length;
						return addToast(`Each of ${total_ben} beneficiary has been assigned ${amount} tokens`, TOAST.SUCCESS);
					}
				} catch (err) {
					addToast(err.message, TOAST.ERROR);
				} finally {
					setLoading(false);
					fetchBeneficiariesBalances({ beneficiaries, timeOut: 1000 });
				}
			}
		},
		[
			addToast,
			amount,
			appSettings.agency,
			bulkTokenIssueToBeneficiary,
			projectId,
			setLoading,
			wallet,
			fetchBeneficiariesBalances
		]
	);

	const handleBulkTokenIssue = useCallback(async () => {
		let beneficiary_tokens = [];
		if (!amount) return addToast('Please enter token amount', TOAST.ERROR);
		const { data } = await beneficiaryByAid(projectId, { limit: BULK_BENEFICIARY_LIMIT });
		if (!data || !data.length) return addToast('No beneficiary available', TOAST.ERROR);
		if (data.length) {
			const beneficiary_phones = data.map(d => d.phone);
			if (beneficiary_phones.length < 1) return addToast('No phone number found', TOAST.ERROR);
			for (let i = 0; i < beneficiary_phones.length; i++) {
				beneficiary_tokens.push(amount);
			}
			toggleAmountModal();
			await submitBulkTokenIssue({
				beneficiaryPhones: beneficiary_phones,
				beneficiaryTokens: beneficiary_tokens,
				beneficiaries: data
			});
		}
	}, [projectId, beneficiaryByAid, amount, addToast, toggleAmountModal, submitBulkTokenIssue]);
	const handleBulkQrExport = async () => {
		const res = await beneficiaryByAid(projectId, { limit: BULK_BENEFICIARY_LIMIT });
		if (!res || !res.data.length) return addToast('No beneficiay available', TOAST.ERROR);
		return printBulkQrCode(res.data);
	};

	const printBulkQrCode = async data => {
		const qrcodeImages = await convertQrToImg(data);
		const html = htmlResponse(data, qrcodeImages);
		toggleAmountModal();
		setAmount('');
		var newWindow = window.open('', 'Print QR', 'fullscreen=yes'),
			document = newWindow.document.open();
		document.write(html);
		document.close();
		setTimeout(function () {
			newWindow.print();
			newWindow.close();
		}, 250);
	};

	const fetchTotalRecords = useCallback(async () => {
		try {
			const data = await beneficiaryByAid(projectId);
			setTotalRecords(data.total);
		} catch (err) {
			addToast('Something went wrong!', {
				appearance: 'error',
				autoDismiss: true
			});
		}
	}, [addToast, beneficiaryByAid, projectId]);

	useEffect(() => {
		fetchTotalRecords();
	}, [fetchTotalRecords]);

	return (
		<>
			<MaskLoader isOpen={loading} message="Assigning tokens in bulk." />

			<ModalWrapper
				toggle={toggleAmountModal}
				open={amountModal}
				title="Set Beneficiary Amount"
				handleSubmit={handleModalFormSubmit}
				loading={loading}
			>
				<FormGroup>
					<InputGroup>
						<Input
							type="number"
							name="amount"
							placeholder="Please enter amount"
							value={amount || ''}
							onChange={handleAmountChange}
						/>
					</InputGroup>
				</FormGroup>
			</ModalWrapper>

			<ModalWrapper
				toggle={toggleUploadListModal}
				open={uploadListModal}
				title="Beneficiary Upload Preview"
				handleSubmit={handleUploadListSubmit}
				loading={uploading}
				size="xl"
			>
				<UploadList data={previewData} />
			</ModalWrapper>

			<div className="container-fluid">
				<Row className="d-none d-sm-block">
					<div style={{ flex: 1, padding: 10 }}>
						<button
							onClick={() => toggleAmountModal(ACTION.BULK_ISSUE)}
							type="button"
							className="btn waves-effect waves-light btn-outline-info"
							style={{ borderRadius: '8px', marginRight: '20px' }}
						>
							Bulk Token Issue
						</button>
						<button
							type="button"
							onClick={() => toggleAmountModal(ACTION.BULK_QR)}
							className="btn waves-effect waves-light btn-outline-info"
							style={{ borderRadius: '8px' }}
						>
							Bulk Generate QR Code
						</button>
						<div style={{ marginTop: '-1px', float: 'right' }}>
							<button
								type="button"
								onClick={handleFileUploadClick}
								className="btn waves-effect waves-light btn-outline-info"
								style={{ borderRadius: '8px' }}
							>
								Upload Beneficiaries
							</button>
							<input
								type="file"
								ref={hiddenFileInput}
								onChange={handleFileChange}
								accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
								style={{ display: 'none' }}
							/>
						</div>
					</div>
				</Row>
				<Row className="d-block d-sm-none">
					<div>
						<button
							onClick={() => toggleAmountModal(ACTION.BULK_ISSUE)}
							type="button"
							className="btn waves-effect waves-light btn-outline-info"
							style={{ borderRadius: '8px', marginRight: '20px' }}
						>
							Bulk Token Issue
						</button>
						<button
							type="button"
							onClick={() => toggleAmountModal(ACTION.BULK_QR)}
							className="btn waves-effect waves-light btn-outline-info"
							style={{ borderRadius: '8px' }}
						>
							Bulk Generate QR Code
						</button>
						<button
							type="button"
							onClick={handleFileUploadClick}
							className="btn waves-effect waves-light btn-outline-info"
							style={{ borderRadius: '8px' }}
						>
							Upload Beneficiaries
						</button>
						<input
							type="file"
							ref={hiddenFileInput}
							onChange={handleFileChange}
							accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
							style={{ display: 'none' }}
						/>
					</div>
				</Row>
				<Row>
					<Col>
						<div className="input-group" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end' }}>
							<CustomInput
								type="select"
								id="customInput-filter"
								style={{ maxWidth: '150px' }}
								className="m-2"
								name="customSelect"
								defaultValue=""
							>
								<option value="phone">Filter By</option>
								<option value="name">Name</option>
								<option value="phoneNumber">Phone Number</option>
								<option value="banked-unbanked">Banked / Unbanked</option>
								<option value="gender">Gender</option>
							</CustomInput>
							<Input className="m-2" style={{ maxWidth: '250px' }} placeholder="Search here..." />

							<button
								type="button"
								className="btn waves-effect waves-light btn-outline-info m-2"
								style={{ borderRadius: '8px' }}
							>
								<Link to="/beneficiary/addBeneficiary">Add New</Link>
							</button>
						</div>
					</Col>
				</Row>
				<Table className="no-wrap v-middle" responsive>
					<thead>
						<tr className="border-0">
							<th className="border-0">S.N.</th>
							<th className="border-0">Name</th>
							<th className="border-0">Address</th>
							<th className="border-0">Phone number</th>
							<th className="border-0">Token</th>
						</tr>
					</thead>
					<tbody>
						{benList.length > 0 ? (
							benList.map((d, i) => {
								return (
									<tr key={d._id}>
										<td>{(currentPage - 1) * PAGE_LIMIT + i + 1}</td>
										<td>
											<Link style={{ color: '#2b7ec1' }} to={`/beneficiaries/${d._id}`}>
												{d.name}
											</Link>
										</td>
										<td>{d.address || '-'}</td>
										<td>{d.phone}</td>
										<td>{fetchingBeneficiaryTokens ? <MiniSpinner /> : d.tokenBalance ? d.tokenBalance : '0'}</td>
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
			</div>
		</>
	);
};

export default List;
