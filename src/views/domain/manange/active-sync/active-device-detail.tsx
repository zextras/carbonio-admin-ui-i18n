/*
 * SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import React, { FC, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import {
	Container,
	Divider,
	Row,
	Text,
	Button,
	Input,
	Padding,
	Table,
	Icon,
	SnackbarManagerContext,
	IconButton
} from '@zextras/carbonio-design-system';
import { useTranslation, Trans } from 'react-i18next';
import styled from 'styled-components';
import Paginig from '../../../components/paging';
import gardian from '../../../../assets/gardian.svg';
import { getAllDevices } from '../../../../services/get-all-devices';
import ListRow from '../../../list/list-row';

const DeviceDetailContainer = styled(Container)`
	z-index: 10;
	position: absolute;
	top: 43px;
	right: 0px;
	bottom: 0px;
	left: ${'max(calc(100% - 680px), 12px)'};
	transition: left 0.2s ease-in-out;
	height: auto;
	width: auto;
	max-height: 100%;
	overflow: hidden;
	box-shadow: -6px 4px 5px 0px rgba(0, 0, 0, 0.1);
`;

const ActiveDeviceDetail: FC<{
	setIsShowDeviceDetail: any;
}> = ({ setIsShowDeviceDetail }) => {
	const [t] = useTranslation();
	return (
		<DeviceDetailContainer background="gray6" mainAlignment="flex-start">
			<Row
				mainAlignment="flex-start"
				crossAlignment="center"
				orientation="horizontal"
				background="white"
				width="fill"
				height="48px"
			>
				<Row padding={{ horizontal: 'small' }}></Row>
				<Row takeAvailableSpace mainAlignment="flex-start">
					xxxx
				</Row>
				<Row padding={{ right: 'extrasmall' }}>
					<IconButton
						size="medium"
						icon="CloseOutline"
						onClick={(): void => setIsShowDeviceDetail(false)}
					/>
				</Row>
			</Row>
			<Divider />
			<ListRow>
				<Container>
					<Button
						type="outlined"
						key="add-button"
						label={t('label.wipe_device', 'Wipe Device')}
						color="primary"
						icon="SmartphoneOutline"
						height={44}
						iconPlacement="right"
					/>
				</Container>
				<Container>
					<Button
						type="outlined"
						key="add-button"
						label={t('label.reset_device', 'Reset Device')}
						color="primary"
						icon="HistoryOutline"
						height={44}
						iconPlacement="right"
					/>
				</Container>
				<Container>
					<Button
						type="outlined"
						key="add-button"
						label={t('label.suspend', 'Suspend')}
						color="primary"
						icon="AlertTriangleOutline"
						height={44}
						iconPlacement="right"
					/>
				</Container>
			</ListRow>
		</DeviceDetailContainer>
	);
};

export default ActiveDeviceDetail;
