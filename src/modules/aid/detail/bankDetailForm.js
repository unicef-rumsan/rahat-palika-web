import React, { useState } from 'react';
import { Card, CardBody, Row, Col, Form, FormGroup, Label, Input, Button } from 'reactstrap';
import FspSelector from '../../global/FspSelector';

const BankDetailForm = ({ bankData, handleBankData }) => {
	const [selectorFsp] = useState('');
	const [swiftCode, setSwiftCode] = useState(null);
	const matchFsp = data => {
		const { bisCode, name } = data;
		handleBankData('institution', name);
		setSwiftCode(bisCode);
	};

	const handleInputChange = e => {
		handleBankData(e.target.name, e.target.value);
	};

	return (
		<div>
			<Row>
				<Col>
					<FormGroup>
						<Label>Swift Code</Label>
						<Input type="text" name="swiftCode" readOnly value={swiftCode || ''} />
					</FormGroup>
					<FormGroup>
						<Label>Account Name</Label>
						<Input
							type="text"
							required
							onChange={handleInputChange}
							name="account_name"
							value={bankData?.account_name}
						/>
					</FormGroup>
				</Col>
				<Col>
					<FormGroup>
						<Label>Bank Name</Label>
						<FspSelector
							fsp={selectorFsp}
							onChange={e => {
								matchFsp(e);
							}}
							label={false}
							projectFsp={true}
						/>
					</FormGroup>
					<FormGroup>
						<Label>Account Number</Label>
						<Input
							type="text"
							required
							onChange={handleInputChange}
							name="account_number"
							value={bankData?.account_number}
						/>
					</FormGroup>
				</Col>
			</Row>
		</div>
	);
};

export default BankDetailForm;
