import React, { useState } from 'react';
import { Card, Row, CardTitle, Col, Button, Form, FormGroup, Input } from 'reactstrap';
import Logo from '../../assets/images/rahat-logo-blue.png';
import './wallet.css';
import { useToasts } from 'react-toast-notifications';
import { TOAST } from '../../constants';
import WalletComponent from './WalletComponent';
import Swal from 'sweetalert2';

const Wallet = () => {
	const { addToast } = useToasts();
	const [isWalletLogin, setIsWalletLogin] = useState(false);

	const toggleLogin = e => {
		e.preventDefault();
		setIsWalletLogin(!isWalletLogin);
	};

	const getOtpAndLogin = async email => {
		const { value: otp } = await Swal.fire({
			title: 'Enter Code',
			input: 'number',
			inputLabel: 'A 6 Digit Code has been sent to your email address',
			allowOutsideClick: true,
			inputValidator: value => {
				if (!value) {
					return 'Please enter 6 digit code sent to your email';
				}
				if (value.length !== 6) return 'Must be 6 digit';
			}
		});
	};

	return (
		<>
			<Row style={{ height: '100vh' }}>
				<Col className="left-content">
					<div className="text-center">
						<img src={Logo} height="200" width="460" alt="rahat logo"></img>
						<div style={{ width: '410px' }}>
							<p className="description">
								Supporting vulnerable communities with a simple and efficient relief distribution platform.
							</p>
						</div>
					</div>
					<p className="text-copyright">Copyright © 2021 Rumsan Group of Companies | All Rights Reserved.</p>
				</Col>
				<Col className="right-content">
					{/* <p className="text-signup">
						Haven’t registered?{' '}
						<Link to={`/sign_up`}>
							<span style={{ color: '#3F9EEB' }}>Sign up</span>
						</Link>
					</p> */}
					<div className=" text-center">
						<p className="text-title">Rahat Palika App</p>
						{!isWalletLogin && (
							<div className="mt-4">
								<Row>
									<Col>
										<Card style={{ padding: '20px', width: '25rem' }}>
											<CardTitle className="text-left">
												<h5>Sign In</h5>
											</CardTitle>
											<p className="mt-2" style={{ color: 'red' }}>
												User does not exists
											</p>
											<Form>
												<FormGroup className="mt-2">
													<Input type="email" name="email" id="exampleEmail" placeholder="Your Email" />
												</FormGroup>
											</Form>
											<div className="text-center">
												<Button
													color="primary"
													type="button"
													size="md"
													onClick={getOtpAndLogin}
													style={{ width: 'fit-content' }}
												>
													Log In
												</Button>
											</div>
											<div className="mt-2">
												<p className="mt-2">
													Do you use Rumsan Wallet? &nbsp;
													<span type="button" onClick={toggleLogin} style={{ color: '#326481' }}>
														Click Here
													</span>
												</p>
											</div>
										</Card>
									</Col>
								</Row>
							</div>
						)}
						{isWalletLogin && <WalletComponent toggleLogin={toggleLogin} />}
					</div>
					<p className="text-privacy">
						By signing up you acknowledge the{' '}
						<a href="https://docs.rahat.io/privacy-policy" className="privacy-policy">
							Privacy Policy
						</a>{' '}
						.
					</p>
				</Col>
			</Row>
		</>
	);
};

export default Wallet;
