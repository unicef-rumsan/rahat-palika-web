import 'react-gallery-carousel/dist/index.css';
import '../../../assets/css/project.css';
import React from 'react';
import Carousel from 'react-gallery-carousel';
import { Card, CardTitle, Col, Row } from 'reactstrap';
import image from '../../../assets/images/id-icon-1.png';
import moment from 'moment';
const IPFS_GATEWAY = process.env.REACT_APP_IPFS_GATEWAY;

export default function VendorInfo(props) {
	const { information, etherBalance } = props;
	const { id } = props.information;

	const CarouselData = [
		{
			src:
				information?.extra_files && information?.govt_id_image
					? `${IPFS_GATEWAY}/ipfs/${information?.govt_id_image}`
					: image
		},
		{
			src:
				information?.extra_files && information?.extra_files?.mou_file
					? `${IPFS_GATEWAY}/ipfs/${information?.extra_files?.mou_file}`
					: image
		}
	];

	return (
		<div>
			<Card>
				<div className="stat-card-body" style={{ minHeight: 120 }}>
					<div style={{ display: 'flex', justifyContent: 'space-between' }}>
						<CardTitle className="title" style={{ flexBasis: '90%' }}>
							More Information
						</CardTitle>
					</div>
					<Row>
						<Col md="4" sm="12">
							<div className="card-data">
								<p className="card-font-medium">{information.shop_name || '-'}</p>
								<div className="sub-title">Shop name</div>
							</div>

							<div className="card-data">
								<p className="card-font-medium">{information.email || '-'}</p>
								<div className="sub-title">Email</div>
							</div>
							<div className="card-data">
								<p className="card-font-medium">{`${information.wallet_address || '-'} (${etherBalance}) `}</p>
								<div className="sub-title">Wallet address</div>
							</div>

							<div className="card-data ">
								<p className="card-font-medium">
									{moment(information.created_at).format('MMM Do YYYY, hh:mm A') || '-'}
								</p>
								<div className="sub-title">Registration Date</div>
							</div>
						</Col>
						<Col md="4" sm="12">
							<div className="card-data">
								<p className="card-font-medium">{information.gender || '-'}</p>
								<div className="sub-title">Gender</div>
							</div>

							<div className="card-data">
								<p className="card-font-medium">{information.phone || '-'}</p>
								<div className="sub-title">Phone number</div>
							</div>
							<div className="card-data">
								<p className="card-font-medium">{information.address || '-'}</p>
								<div className="sub-title">Address</div>
							</div>
							<div className="card-data">
								<p className="card-font-medium">{information.pan_number || '-'}</p>
								<div className="sub-title">PAN number</div>
							</div>
						</Col>
						<Col md="4" sm="12">
							<Carousel
								images={CarouselData}
								hasMediaButton={false}
								objectFit="contain"
								hasThumbnails={false}
								className="bg-white border"
							/>
						</Col>
					</Row>
				</div>
			</Card>
		</div>
	);
}
