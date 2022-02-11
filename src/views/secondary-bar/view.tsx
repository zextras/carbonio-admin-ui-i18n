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

const SecondaryBarView: FC = () => {
	const [t] = useTranslation();
	return (
		<Container
			padding={{ all: 'small' }}
			height="fit"
			orientation="vertical"
			mainAlignment="flex-start"
			crossAlignment="flex-start"
		>
			<Text>{t('label.secondary_bar_view', 'Secondary Bar')}</Text>
			<Padding bottom="small">
				<Button
					label="aaa"
					onClick={(): void => {
						pushHistory({ route: SECONDARY_ROUTE, path: 'hello' });
					}}
				/>
			</Padding>
			<Padding bottom="small">
				<Button label="bbb" />
			</Padding>
			<Padding bottom="small">
				<Button label="ccc" />
			</Padding>
		</Container>
	);
};
export default SecondaryBarView;
