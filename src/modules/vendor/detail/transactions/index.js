import React, { useState } from 'react';
import classnames from 'classnames';

import { Card, Col, Row, TabContent, TabPane, Nav, NavItem, NavLink } from 'reactstrap';
import { TRANSACTION_TABS } from '../../../../constants';
import TokenTab from './token';

const TransactionHistory = props => {
	const { transactions, fetching } = props;
	const [currentHistoryTab, setCurrentHistoryTab] = useState(TRANSACTION_TABS.TOKEN);

	const toggleTabs = tabName => setCurrentHistoryTab(tabName);

	return (
		<div>
			<p className="page-heading">Transaction History</p>
			<Card>
				<div className="stat-card-body">
					<Nav tabs>
						<NavItem>
							<NavLink
								className={classnames({ active: currentHistoryTab === TRANSACTION_TABS.TOKEN })}
								onClick={() => {
									toggleTabs(TRANSACTION_TABS.TOKEN);
								}}
							>
								Tokens
							</NavLink>
						</NavItem>
					</Nav>
					<TabContent className="pt-2" activeTab={currentHistoryTab === TRANSACTION_TABS.TOKEN ? '1' : '2'}>
						<TabPane tabId="1">
							<Row>
								<Col sm="12">
									<TokenTab transactions={transactions} fetching={fetching} />
								</Col>
							</Row>
						</TabPane>
					</TabContent>
				</div>
			</Card>
		</div>
	);
};

export default TransactionHistory;
