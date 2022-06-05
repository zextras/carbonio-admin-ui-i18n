/*
 * SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import React, { FC, useEffect, useState, useMemo, useContext, useCallback } from 'react';
import { filter } from 'lodash';
import {
	Container,
	Input,
	Row,
	Text,
	IconButton,
	Button,
	Padding,
	Icon,
	Table,
	Divider
} from '@zextras/carbonio-design-system';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

const AppointmentCardContainer = styled(Container)`
	z-index: 10;
	position: absolute;
	top: 62px;
	right: 12px;
	bottom: 0px;
	left: ${'max(calc(100% - 680px), 12px)'};
	transition: left 0.2s ease-in-out;
	height: auto;
	width: auto;
	max-height: 100%;
	overflow: hidden;
	box-shadow: -6px 4px 5px 0px rgba(0, 0, 0, 0.4);
`;

const AccountDetailView: FC<any> = ({ selectedAccount, setShowAccountDetailView }) => {
	const [t] = useTranslation();
	return (
		<AppointmentCardContainer background="gray5" mainAlignment="flex-start">
			<Row
				mainAlignment="flex-start"
				crossAlignment="center"
				orientation="horizontal"
				background="gray5"
				width="fill"
				height="48px"
				padding={{ vertical: 'small' }}
			>
				<Row padding={{ horizontal: 'large' }}>
					<Icon icon="NewAppointmentOutline" />
				</Row>
				<Row takeAvailableSpace mainAlignment="flex-start">
					<Text size="medium" overflow="ellipsis">
						{`${selectedAccount?.item?.name} ${t('label.details', 'Details')}`}
					</Text>
				</Row>
				<Row padding={{ right: 'extrasmall' }}>
					<IconButton
						size="medium"
						icon="CloseOutline"
						onClick={(): void => setShowAccountDetailView(false)}
					/>
				</Row>
			</Row>
			<Container padding={{ all: 'none' }} mainAlignment="flex-start" height="calc(100% - 64px)">
				{' '}
			</Container>
		</AppointmentCardContainer>
	);
};
export default AccountDetailView;
