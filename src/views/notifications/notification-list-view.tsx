/*
 * SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import React, { FC } from 'react';
import { Container } from '@zextras/carbonio-design-system';
import ListRow from '../list/list-row';
import NotificationView from '../app/shared/notification-view';

const NotificationListView: FC = () => {
	console.log('xxx');
	return (
		<Container background="gray6" style={{ 'border-radius': '0.5rem' }}>
			<ListRow>
				<NotificationView isShowTitle />
			</ListRow>
		</Container>
	);
};

export default NotificationListView;
