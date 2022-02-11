/*
 * SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Container, Text, Padding, Button } from '@zextras/carbonio-design-system';
import { pushHistory } from '@zextras/carbonio-shell-ui';
import { SECONDARY_ROUTE } from '../../constants';

const MainAppView: FC = () => {
	const [t] = useTranslation();
	return (
		<Container
			width="fill"
			height="fill"
			padding={{ all: 'large' }}
			orientation="vertical"
			mainAlignment="flex-start"
			crossAlignment="flex-start"
		>
			<Text>{t('label.main_view', 'This is a main view')}</Text>
			<Container
				padding={{ vertical: 'small' }}
				height="fit"
				orientation="horizontal"
				mainAlignment="flex-start"
				className="BYPASS"
			>
				<Padding right="small">
					<Button
						label="go to secondary"
						onClick={(): void => {
							pushHistory({ route: SECONDARY_ROUTE, path: 'hello' });
						}}
					/>
				</Padding>
				<Padding right="small">
					<Button label="bbb" />
				</Padding>
				<Padding right="small">
					<Button label="ccc" />
				</Padding>
			</Container>
		</Container>
	);
};
export default MainAppView;
