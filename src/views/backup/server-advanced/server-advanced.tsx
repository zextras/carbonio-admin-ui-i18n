/*
 * SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import React, { FC, useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import {
	Container,
	Row,
	Text,
	Divider,
	Button,
	Switch,
	Input,
	SnackbarManagerContext,
	Padding
} from '@zextras/carbonio-design-system';
import {
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore
	getSoapFetchRequest
} from '@zextras/carbonio-shell-ui';
import ListRow from '../../list/list-row';
import { useServerStore } from '../../../store/server/store';

const ServerAdvanced: FC = () => {
	const { operation, server }: { operation: string; server: string } = useParams();
	const allServers = useServerStore((state) => state.serverList);
	const [t] = useTranslation();
	const createSnackbar: any = useContext(SnackbarManagerContext);
	const [isDirty, setIsDirty] = useState<boolean>(false);
	const [ldapDumpEnabled, setLdapDumpEnabled] = useState<boolean>(false);
	const [serverConfiguration, setServerConfiguration] = useState<boolean>(false);
	const [purgeOldConfiguration, setPurgeOldConfiguration] = useState<boolean>(false);
	const [includeIndex, setIncludeIndex] = useState<boolean>(false);
	const [backupLatencyLowThreshold, setBackupLatencyLowThreshold] = useState<number>(0);
	const [backupLatencyHighThreshold, setBackupLatencyHighThreshold] = useState<number>(0);
	const [backupMaxWaitTime, setBackupMaxWaitTime] = useState<number>(0);
	const [backupMaxMetaDataSize, setBackupMaxMetaDataSize] = useState<number>(0);
	const [backupOnTheFlyMetadata, setBackupOnTheFlyMetadata] = useState<boolean>(false);
	const [backupMaxOperationPerAccount, setBackupMaxOperationPerAccount] = useState<number>(0);
	const [backupCompressionLevel, setBackupCompressionLevel] = useState<number>(0);
	const [backupNumberThreadsForItems, setBackupNumberThreadsForItems] = useState<number>(0);
	const [backupNumberThreadsForAccounts, setBackupNumberThreadsForAccounts] = useState<number>(0);

	const [scheduledMetadataArchivingEnabled, setScheduledMetadataArchivingEnabled] =
		useState<boolean>(false);

	useEffect(() => {
		if (allServers && allServers.length > 0) {
			const selectedServer = allServers.find((serverItem: any) => serverItem?.name === server);
			if (selectedServer && selectedServer?.id) {
				getSoapFetchRequest(
					`/service/extension/zextras_admin/core/getServer/${selectedServer?.id}?module=zxbackup`
				)
					.then((data: any) => {
						if (data && data?.attributes) {
							const attributes = data?.attributes;
							if (attributes?.ldapDumpEnabled) {
								const value = attributes?.ldapDumpEnabled?.value;
								if (value) {
									setLdapDumpEnabled(value);
								}
							}

							if (attributes?.backupLatencyLowThreshold) {
								const value = attributes?.backupLatencyLowThreshold?.value;
								if (value) {
									setBackupLatencyLowThreshold(value);
								}
							}

							if (attributes?.backupLatencyHighThreshold) {
								const value = attributes?.backupLatencyHighThreshold?.value;
								if (value) {
									setBackupLatencyHighThreshold(value);
								}
							}

							if (attributes?.ZxBackup_MaxWaitingTime) {
								const value = attributes?.ZxBackup_MaxWaitingTime?.value;
								if (value) {
									setBackupMaxWaitTime(value);
								}
							}

							if (attributes?.ZxBackup_MaxMetadataSize) {
								const value = attributes?.ZxBackup_MaxMetadataSize?.value;
								if (value) {
									setBackupMaxMetaDataSize(value);
								}
							}

							if (attributes?.backupOnTheFlyMetadata) {
								const value = attributes?.backupOnTheFlyMetadata?.value;
								if (value) {
									setBackupOnTheFlyMetadata(value);
								}
							}

							if (attributes?.scheduledMetadataArchivingEnabled) {
								const value = attributes?.scheduledMetadataArchivingEnabled?.value;
								if (value) {
									setScheduledMetadataArchivingEnabled(value);
								}
							}

							if (attributes?.ZxBackup_MaxOperationPerAccount) {
								const value = attributes?.ZxBackup_MaxOperationPerAccount?.value;
								if (value) {
									setBackupMaxOperationPerAccount(value);
								}
							}

							if (attributes?.backupCompressionLevel) {
								const value = attributes?.backupCompressionLevel?.value;
								if (value) {
									setBackupCompressionLevel(value);
								}
							}

							if (attributes?.backupNumberThreadsForItems) {
								const value = attributes?.backupNumberThreadsForItems?.value;
								if (value) {
									setBackupNumberThreadsForItems(value);
								}
							}

							if (attributes?.backupNumberThreadsForAccounts) {
								const value = attributes?.backupNumberThreadsForAccounts?.value;
								if (value) {
									setBackupNumberThreadsForAccounts(value);
								}
							}
						}
					})
					.catch((error: any) => {
						createSnackbar({
							key: 'error',
							type: 'error',
							label: error?.message
								? error?.message
								: t('label.something_wrong_error_msg', 'Something went wrong. Please try again.'),
							autoHideTimeout: 3000,
							hideButton: true,
							replace: true
						});
					});
			}
		}
	}, [server, allServers, createSnackbar, t]);
	return (
		<Container mainAlignment="flex-start" background="gray6">
			<Container
				orientation="column"
				background="gray6"
				crossAlignment="flex-start"
				mainAlignment="flex-start"
			>
				<Row takeAvwidth="fill" mainAlignment="flex-start" width="100%">
					<Container orientation="vertical" mainAlignment="space-around" height="56px">
						<Row orientation="horizontal" width="100%">
							<Row
								padding={{ all: 'large' }}
								mainAlignment="flex-start"
								width="50%"
								crossAlignment="flex-start"
							>
								<Text size="medium" weight="bold" color="gray0">
									{t('backup.advanced', 'Advanced')}
								</Text>
							</Row>
							<Row
								padding={{ all: 'large' }}
								width="50%"
								mainAlignment="flex-end"
								crossAlignment="flex-end"
							>
								<Padding right="small">
									{isDirty && <Button label={t('label.cancel', 'Cancel')} color="secondary" />}
								</Padding>
								{isDirty && <Button label={t('label.save', 'Save')} color="primary" />}
							</Row>
						</Row>
					</Container>
					<Divider color="gray2" />
				</Row>

				<Container
					mainAlignment="flex-start"
					crossAlignment="flex-end"
					style={{ overflow: 'auto' }}
					padding={{ all: 'large' }}
					height="calc(100vh - 150px)"
				>
					<ListRow>
						<Container
							padding={{ top: 'large' }}
							mainAlignment="flex-start"
							crossAlignment="flex-start"
						>
							<Switch
								label={t('backup.ldap_dump', 'LDAP Dump')}
								value={ldapDumpEnabled}
								onClick={(): void => setLdapDumpEnabled(!ldapDumpEnabled)}
							/>
						</Container>
						<Container padding={{ top: 'large' }}>
							<Switch
								label={t('backup.include_server_configuration', 'Include server configuration')}
								value={serverConfiguration}
								onClick={(): void => setServerConfiguration(!serverConfiguration)}
							/>
						</Container>
						<Container padding={{ top: 'large' }}>
							<Switch
								label={t('backup.purge_old_configuration', 'Purge old configuration')}
								value={purgeOldConfiguration}
								onClick={(): void => setPurgeOldConfiguration(!purgeOldConfiguration)}
							/>
						</Container>
						<Container padding={{ top: 'large' }}>
							<Switch
								label={t('backup.include_index', 'Include index')}
								value={includeIndex}
								onClick={(): void => setIncludeIndex(!includeIndex)}
							/>
						</Container>
					</ListRow>

					<ListRow>
						<Container
							mainAlignment="flex-start"
							crossAlignment="flex-start"
							padding={{ top: 'large' }}
						>
							<Button
								type="outlined"
								label={t('backup.check_ldap', 'Check ldap')}
								color="primary"
								icon="ActivityOutline"
								iconPlacement="right"
								height={36}
								width="fit"
							/>
						</Container>
					</ListRow>

					<Container
						mainAlignment="flex-start"
						crossAlignment="flex-start"
						padding={{ top: 'extralarge' }}
						height="fit"
					>
						<Text size="medium" weight="bold">
							{t('backup.tuning_options', 'Tuning Options')}
						</Text>
					</Container>

					<Container
						mainAlignment="flex-start"
						crossAlignment="flex-start"
						padding={{ top: 'large' }}
						height="fit"
					>
						<Text size="medium" weight="bold">
							{t('backup.latency', 'Latency')}
						</Text>
					</Container>

					<ListRow>
						<Container
							mainAlignment="flex-start"
							crossAlignment="flex-start"
							orientation="horizontal"
							padding={{ top: 'large', right: 'large' }}
							width="50%"
						>
							<Input
								label={t('backup.latency_high_threshold_ms', 'Latency High Threshold (ms)')}
								background="gray5"
								value={backupLatencyHighThreshold}
								onChange={(e: any): any => {
									setBackupLatencyHighThreshold(e.target.value);
								}}
							/>
						</Container>
						<Container
							mainAlignment="flex-start"
							crossAlignment="flex-start"
							orientation="horizontal"
							padding={{ top: 'large', right: 'large' }}
							width="50%"
						>
							<Input
								label={t('backup.latency_low_threshold_ms', 'Latency Low Threshold (ms)')}
								background="gray5"
								value={backupLatencyLowThreshold}
								onChange={(e: any): any => {
									setBackupLatencyLowThreshold(e.target.value);
								}}
							/>
						</Container>
					</ListRow>

					<Container
						mainAlignment="flex-start"
						crossAlignment="flex-start"
						padding={{ top: 'extralarge' }}
						height="fit"
					>
						<Text size="medium" weight="bold">
							{t('backup.waiting_time', 'Waititng Time')}
						</Text>
					</Container>

					<ListRow>
						<Container
							mainAlignment="flex-start"
							crossAlignment="flex-start"
							orientation="horizontal"
							padding={{ top: 'large', right: 'large' }}
							width="100%"
						>
							<Input
								label={t('backup.max_waiting_time_ms', 'Max Waiting Time (ms)')}
								background="gray5"
								borderColor="gray3"
								value={backupMaxWaitTime}
								onChange={(e: any): any => {
									setBackupMaxWaitTime(e.target.value);
								}}
							/>
						</Container>
					</ListRow>

					<Container
						mainAlignment="flex-start"
						crossAlignment="flex-start"
						padding={{ top: 'extralarge' }}
						height="fit"
					>
						<Text size="medium" weight="bold">
							{t('backup.metadata', 'Metadata')}
						</Text>
					</Container>

					<ListRow>
						<Container
							mainAlignment="flex-start"
							crossAlignment="flex-start"
							orientation="horizontal"
							padding={{ top: 'large', right: 'large' }}
							width="100%"
						>
							<Input
								label={t('backup.maximum_metadata_size_mb', 'Maximum Metadata Size (MB)')}
								background="gray5"
								value={backupMaxMetaDataSize}
								onChange={(e: any): any => {
									setBackupMaxMetaDataSize(e.target.value);
								}}
							/>
						</Container>
					</ListRow>

					<ListRow>
						<Container
							mainAlignment="flex-start"
							crossAlignment="flex-start"
							orientation="horizontal"
							padding={{ top: 'large', right: 'large' }}
							width="100%"
						>
							<Switch
								label={t('backup.on_the_fly_metadata', 'On the fly metadata')}
								value={backupOnTheFlyMetadata}
								onClick={(): void => setBackupOnTheFlyMetadata(!backupOnTheFlyMetadata)}
							/>
						</Container>
					</ListRow>

					<ListRow>
						<Container
							mainAlignment="flex-start"
							crossAlignment="flex-start"
							orientation="horizontal"
							padding={{ top: 'large', right: 'large' }}
							width="100%"
						>
							<Switch
								label={t('backup.metadata_archiving', 'Metadata archiving')}
								value={scheduledMetadataArchivingEnabled}
								onClick={(): void =>
									setScheduledMetadataArchivingEnabled(!scheduledMetadataArchivingEnabled)
								}
							/>
						</Container>
					</ListRow>

					<Container
						mainAlignment="flex-start"
						crossAlignment="flex-start"
						padding={{ top: 'extralarge' }}
						height="fit"
					>
						<Text size="medium" weight="bold">
							{t('backup.other_controls', 'Other Controls')}
						</Text>
					</Container>

					<ListRow>
						<Container
							mainAlignment="flex-start"
							crossAlignment="flex-start"
							orientation="horizontal"
							padding={{ top: 'large', right: 'large' }}
							width="500%"
						>
							<Input
								label={t('backup.maximum_operation_per_account', 'Maximum Operation per Account')}
								background="gray5"
								value={backupMaxOperationPerAccount}
								onChange={(e: any): any => {
									setBackupMaxOperationPerAccount(e.target.value);
								}}
							/>
						</Container>
						<Container
							mainAlignment="flex-start"
							crossAlignment="flex-start"
							orientation="horizontal"
							padding={{ top: 'large', right: 'large' }}
							width="500%"
						>
							<Input
								label={t('backup.compression_level', 'Compression Level')}
								background="gray5"
								value={backupCompressionLevel}
								onChange={(e: any): any => {
									setBackupCompressionLevel(e.target.value);
								}}
							/>
						</Container>
					</ListRow>

					<ListRow>
						<Container
							mainAlignment="flex-start"
							crossAlignment="flex-start"
							orientation="horizontal"
							padding={{ top: 'large', right: 'large' }}
							width="500%"
						>
							<Input
								label={t('backup.thread_number_for_items', 'Thread number for items')}
								background="gray5"
								value={backupNumberThreadsForItems}
								onChange={(e: any): any => {
									setBackupNumberThreadsForItems(e.target.value);
								}}
							/>
						</Container>
						<Container
							mainAlignment="flex-start"
							crossAlignment="flex-start"
							orientation="horizontal"
							padding={{ top: 'large', right: 'large' }}
							width="500%"
						>
							<Input
								label={t('backup.thread_number_for_accounts', 'Thread number for accounts')}
								background="gray5"
								value={backupNumberThreadsForAccounts}
								onChange={(e: any): any => {
									setBackupNumberThreadsForAccounts(e.target.value);
								}}
							/>
						</Container>
					</ListRow>
				</Container>
			</Container>
		</Container>
	);
};
export default ServerAdvanced;
