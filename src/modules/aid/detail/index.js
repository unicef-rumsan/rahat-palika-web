import React, { useContext, useEffect, useState } from 'react';
import { Row, Col } from 'reactstrap';
import { useToasts } from 'react-toast-notifications';

import { AidContext } from '../../../contexts/AidContext';
import { AppContext } from '../../../contexts/AppSettingsContext';
import DetailsCard from '../../global/DetailsCard';
import ProjectInfo from './projectInfo';
import PieChart from './pieChart';
import Tabs from './tab';
import { TOAST, PROJECT_STATUS } from '../../../constants';
import { getProjectFromLS, setProjectToLS, getActiveProject } from '../../../utils/checkProject';
import DataService from '../../../services/db';

export default function Index(props) {
	const { addToast } = useToasts();
	const [projectDetails, setProjectDetails] = useState(null);
	const [projectId, setProjectId] = useState('');
	let { id } = props.match.params;
	const {
		total_tokens,
		available_tokens,
		getAidDetails,
		changeProjectStatus,
		getProjectCapital,
		setProjectCapital,
		getAidBalance,
		setAidBalance
	} = useContext(AidContext);
	const { appSettings } = useContext(AppContext);

	const handleStatusChange = status => {
		const success_label = status === PROJECT_STATUS.CLOSED ? 'Closed' : 'Activated';
		changeProjectStatus(projectId, status)
			.then(d => {
				setProjectDetails(d);
				addToast(`Project has been ${success_label}`, TOAST.SUCCESS);
			})
			.catch(err => {
				addToast(err.message, TOAST.ERROR);
			});
	};

	const fetchProjectDetails = () => {
		getAidDetails(projectId)
			.then(res => {
				setProjectDetails(res);
			})
			.catch(err => {
				addToast(err.message, TOAST.ERROR);
			});
	};

	useEffect(() => {
		async function assignProjectId() {
			if (id === 'current') {
				const currentProject = getProjectFromLS();
				if (currentProject) {
					setProjectId(currentProject);
				} else {
					const proj = await getActiveProject();
					setProjectToLS(proj);
					setProjectId(proj);
				}
			} else {
				setProjectId(id);
				setProjectToLS(id);
			}
		}
		assignProjectId();
	}, [id]);

	useEffect(fetchProjectDetails, [projectId]);

	useEffect(() => {
		async function fetchPackageAndTokenBalance() {
			if (!appSettings) return;
			const { agency } = appSettings;
			if (!agency || !agency.contracts) return;
			try {
				if (projectId) {
					// get balance from indexDB
					const existingBalance = await DataService.getProjectBalance('balance', projectId);
					if (existingBalance) {
						setProjectCapital(existingBalance.total);
						setAidBalance(existingBalance.balance);
					} else {
						// set balance to indexDB from API
						const { rahat_admin } = agency.contracts;
						const total = await getProjectCapital(projectId, rahat_admin);
						const balance = await getAidBalance(projectId, rahat_admin);
						if (balance && total) {
							await DataService.setProjectBalance('balance', [{ project: projectId, balance, total }]);
						}
					}
				}
			} catch (err) {
				console.log({ err });
				addToast(err.message, TOAST.ERROR);
			} finally {
				// Check if API has updated data and set in indexDB
				const { rahat_admin } = agency.contracts;
				const total = await getProjectCapital(projectId, rahat_admin);
				const balance = await getAidBalance(projectId, rahat_admin);
				if (balance && total) {
					await DataService.updateProjectBalance('balance', [{ project: projectId, balance, total }]);
				}
			}
		}
		fetchPackageAndTokenBalance();
	}, [addToast, appSettings, getAidBalance, getProjectCapital, projectId, setAidBalance, setProjectCapital]);
	return (
		<>
			<div style={{ height: '100px' }}></div>
			<Row>
				<Col md="7">
					{projectDetails && (
						<DetailsCard
							title="Project Details"
							button_name="Generate QR Code"
							name="Project Name"
							name_value={projectDetails.name}
							status={projectDetails.status}
							total="Project Budget"
							total_value={total_tokens}
							handleStatusChange={handleStatusChange}
						/>
					)}
					{projectDetails && <ProjectInfo projectDetails={projectDetails} />}
				</Col>
				<Col md="5">
					{projectDetails && (
						<PieChart available_tokens={available_tokens} total_tokens={total_tokens} projectId={projectId} />
					)}
				</Col>
			</Row>
			{projectId && <Tabs projectId={projectId} />}
		</>
	);
}
