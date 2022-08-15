/*
 * SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import React, { FC, useMemo, useState } from 'react';
import { Container, Row, Text, Divider, Table, Button } from '@zextras/carbonio-design-system';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { NO } from '../../../constants';

const RelativeContainer = styled(Container)`
	position: relative;
`;

const VolumeListTable: FC<{
	volumes: Array<any>;
	selectedRows: any;
	onSelectionChange: any;
	headers: any;
}> = ({ volumes, selectedRows, onSelectionChange, headers }) => {
	const tableRows = useMemo(
		() =>
			volumes.map((v, i) => ({
				id: i,
				columns: [
					<Row key={i} style={{ textAlign: 'left', justifyContent: 'flex-start' }}>
						{v.item1}
					</Row>,
					<Row key={i} style={{ textAlign: 'center' }}>
						{v.item2}
					</Row>,
					<Row key={i} color={v.current === NO ? 'error' : 'text'} style={{ textAlign: 'center' }}>
						<Text color={v.item3 === NO ? 'error' : 'text'}>{v.item3}</Text>
					</Row>,
					<Row key={i} style={{ textAlign: 'center' }}>
						<Text color={v.item4 === NO ? 'error' : 'text'}>{v.item4}</Text>
					</Row>
				],
				clickable: true
			})),
		[volumes]
	);

	return (
		<Container crossAlignment="flex-start">
			<Table
				headers={headers}
				rows={tableRows}
				showCheckbox={false}
				multiSelect={false}
				selectedRows={selectedRows}
				onSelectionChange={onSelectionChange}
			/>
			{tableRows.length === 0 && (
				<Row padding={{ top: 'extralarge', horizontal: 'extralarge' }} width="fill">
					<Text>Empty Table</Text>
				</Row>
			)}
		</Container>
	);
};

const VolumesDetailPanel: FC = () => {
	const [t] = useTranslation();
	const [volumeselection, setVolumeselection] = useState('');
	const headers = [
		{
			id: 'name',
			label: 'Name',
			width: '62%',
			bold: true,
			align: 'left',
			items: [
				{ label: 'Volumename_1', value: '1' },
				{ label: 'Volumename_2', value: '2' }
			]
		},
		{
			id: 'allocation',
			label: 'Allocation',
			width: '12%',
			align: 'center',
			bold: true,
			items: [
				{ label: 'Allocation_1', value: '1' },
				{ label: 'Allocation_2', value: '2' }
			]
		},
		{
			id: 'current',
			label: 'Current',
			width: '12%',
			align: 'center',
			bold: true
		},
		{
			id: 'compression',
			label: 'Compression',
			i18nAllLabel: 'All',
			width: '14%',
			align: 'center',
			bold: true
		}
	];

	const indexerHeaders = [
		{
			id: 'name',
			label: 'Name',
			width: '62%',
			bold: true,
			align: 'left',
			items: [
				{ label: 'Volumename_1', value: '1' },
				{ label: 'Volumename_2', value: '2' }
			]
		},
		{
			id: 'path',
			label: 'Path',
			width: '12%',
			align: 'center',
			bold: true,
			items: [
				{ label: 'Allocation_1', value: '1' },
				{ label: 'Allocation_2', value: '2' }
			]
		},
		{
			id: 'current',
			label: 'Current',
			width: '12%',
			align: 'center',
			bold: true
		},
		{
			width: '14%'
		}
	];
	const primaryVolumeList = [
		{
			item1: 'VolumeName#1',
			item2: 'Local',
			item3: 'Yes',
			item4: 'Yes'
		},
		{
			item1: 'VolumeExtraName#2',
			item2: 'Local',
			item3: 'No',
			item4: 'No'
		},
		{
			item1: 'AnotherVolName#3',
			item2: 'Local',
			item3: 'No',
			item4: 'No'
		}
	];

	const secondaryVolumeList = [
		{
			item1: 'VolumeSecName#1',
			item2: 'Local',
			item3: 'Yes',
			item4: 'Yes'
		},
		{
			item1: 'VolumeSecExtraName#2',
			item2: 'Local',
			item3: 'No',
			item4: 'No'
		}
	];

	const indexerVolumeList = [
		{
			item1: 'VolumeSecName#1',
			item2: '/.../...',
			item3: 'Yes'
		},
		{
			item1: 'VolumeSecExtraName#2',
			item2: '/.../...',
			item3: 'No'
		}
	];
	return (
		<>
			<RelativeContainer
				orientation="column"
				crossAlignment="flex-start"
				mainAlignment="flex-start"
				style={{ overflowY: 'auto' }}
				background="white"
			>
				<Row mainAlignment="flex-start" padding={{ all: 'large' }}>
					<Text size="extralarge" weight="bold">
						{t('buckets.serverName#1_volumes', 'ServerName#1 Volumes')}
					</Text>
				</Row>
				<Divider />
				<Container
					orientation="column"
					crossAlignment="flex-start"
					mainAlignment="flex-start"
					width="100%"
					height="calc(100vh - 200px)"
					padding={{ top: 'extralarge', bottom: 'large' }}
				>
					<Container height="fit" crossAlignment="flex-start" background="gray6">
						<Row
							width="100%"
							mainAlignment="flex-end"
							orientation="horizontal"
							padding={{ top: 'small', right: 'large', left: 'large' }}
							style={{ gap: '16px' }}
						>
							<Button
								type="outlined"
								label={t('label.delete_button', 'DELETE')}
								icon="CloseOutline"
								color="error"
								disabled
							/>
							<Button
								type="outlined"
								label={t('label.edit_button', 'EDIT')}
								icon="EditOutline"
								color="secondary"
								disabled
							/>
							<Button
								type="outlined"
								label={t('label.new_volume_button', 'NEW VOLUME')}
								icon="PlusOutline"
								color="primary"
							/>
						</Row>
						<Row
							width="100%"
							mainAlignment="flex-start"
							orientation="horizontal"
							padding={{ horizontal: 'large', top: 'large', bottom: 'small' }}
						>
							<Text>Primary</Text>
						</Row>
						<Row padding={{ horizontal: 'large' }} width="100%">
							<VolumeListTable
								volumes={primaryVolumeList}
								headers={headers}
								selectedRows={volumeselection}
								onSelectionChange={(selected: any): any => {
									// const volumeObject: any = volumeList.find(
									// 	(s, index) => index === selected[0]
									// );
								}}
							/>
						</Row>
						<Row
							width="100%"
							mainAlignment="flex-start"
							orientation="horizontal"
							padding={{
								horizontal: 'large',
								vertical: 'extralarge'
							}}
						>
							<Container
								orientation="horizontal"
								mainAlignment="flex-start"
								style={{ gap: '16px' }}
							>
								<Button
									type="outlined"
									width="fill"
									label={t('label.set_as_secondary_button', 'SET AS SECONDARY')}
									icon="ArrowheadDown"
									iconPlacement="left"
									color="primary"
									disabled
								/>
								<Button
									type="outlined"
									width="fill"
									label={t('label.new_volumeset_as_primary_button', 'SET AS PRIMARY')}
									icon="ArrowheadUp"
									iconPlacement="left"
									color="secondary"
									disabled
								/>
							</Container>
						</Row>
						<Row
							width="100%"
							mainAlignment="flex-start"
							orientation="horizontal"
							padding={{
								horizontal: 'large',
								bottom: 'small'
							}}
						>
							<Text>Secondary</Text>
						</Row>
						<Row
							padding={{
								horizontal: 'large',
								bottom: 'extralarge'
							}}
							width="100%"
						>
							<VolumeListTable
								volumes={secondaryVolumeList}
								headers={headers}
								selectedRows={volumeselection}
								onSelectionChange={(selected: any): any => {
									// const volumeObject: any = volumeList.find(
									// 	(s, index) => index === selected[0]
									// );
								}}
							/>
						</Row>
						<Row
							width="100%"
							mainAlignment="flex-start"
							orientation="horizontal"
							padding={{
								horizontal: 'large',
								vertical: 'small'
							}}
						>
							<Text>Indexer</Text>
						</Row>
						<Row
							padding={{
								horizontal: 'large',
								bottom: 'extralarge'
							}}
							width="100%"
						>
							<VolumeListTable
								volumes={indexerVolumeList}
								headers={indexerHeaders}
								selectedRows={volumeselection}
								onSelectionChange={(selected: any): any => {
									// const volumeObject: any = volumeList.find(
									// 	(s, index) => index === selected[0]
									// );
								}}
							/>
						</Row>
					</Container>
				</Container>
			</RelativeContainer>
		</>
	);
};

export default VolumesDetailPanel;
