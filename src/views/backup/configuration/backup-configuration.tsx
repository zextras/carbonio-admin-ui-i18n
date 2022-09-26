/*
 * SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import React, { FC, useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
	Container,
	Row,
	Text,
	Divider,
	Button,
	Switch,
	Input,
	SnackbarManagerContext
} from '@zextras/carbonio-design-system';
import {
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore
	getSoapFetchRequest
} from '@zextras/carbonio-shell-ui';
import { useParams } from 'react-router-dom';
import ListRow from '../../list/list-row';
import { useServerStore } from '../../../store/server/store';

const BackupConfiguration: FC = () => {
	const { operation, server }: { operation: string; server: string } = useParams();
	const [t] = useTranslation();
	const allServers = useServerStore((state) => state.serverList);
	const createSnackbar: any = useContext(SnackbarManagerContext);
	const [moduleEnableStartup, setModuleEnableStartup] = useState<boolean>(false);
	const [enableRealtimeScanner, setEnableRealtimeScanner] = useState<boolean>(false);
	const [runSmartScanStartup, setRunSmartScanStartup] = useState<boolean>(false);
	const [spaceThreshold, setSpaceThreshold] = useState<number>(0);
	const [isScheduleSmartscan, setIsScheduleSmartScan] = useState<boolean>(false);
	const [scheduleSmartScan, setScheduleSmartScan] = useState<string>('');
	const [keepDeletedItemInBackup, setKeepDeletedItemInBackup] = useState<number>(0);
	const [keepDeletedAccountsInBackup, setKeepDeletedAccountsInBackup] = useState<number>(0);
	const [scheduleAutomaticRetentionPolicy, setScheduleAutomaticRetentionPolicy] =
		useState<boolean>(false);
	const [retentionPolicySchedule, setRetentionPolicySchedule] = useState<string>('');
	const [backupDestPath, setBackupDestPath] = useState<string>('');
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
							if (attributes?.ZxBackup_ModuleEnabledAtStartup) {
								const value = attributes?.ZxBackup_ModuleEnabledAtStartup?.value;
								if (value) {
									setModuleEnableStartup(value);
								}
							}

							if (attributes?.ZxBackup_RealTimeScanner) {
								const value = attributes?.ZxBackup_RealTimeScanner?.value;
								if (value) {
									setEnableRealtimeScanner(value);
								}
							}

							if (attributes?.ZxBackup_DoSmartScanOnStartup) {
								const value = attributes?.ZxBackup_DoSmartScanOnStartup?.value;
								if (value) {
									setRunSmartScanStartup(value);
								}
							}

							if (attributes?.ZxBackup_SpaceThreshold) {
								const value = attributes?.ZxBackup_SpaceThreshold?.value;
								if (value) {
									setSpaceThreshold(value);
								}
							}

							if (attributes?.backupSmartScanScheduler) {
								const value = attributes?.backupSmartScanScheduler?.value;
								if (value && value['cron-enabled']) {
									setIsScheduleSmartScan(value['cron-enabled']);
								}
								if (value && value['cron-pattern']) {
									setScheduleSmartScan(value['cron-pattern']);
								}
							}

							if (attributes?.backupPurgeScheduler) {
								const value = attributes?.backupPurgeScheduler?.value;
								if (value && value['cron-enabled']) {
									setScheduleAutomaticRetentionPolicy(value['cron-enabled']);
								}
								if (value && value['cron-pattern']) {
									setRetentionPolicySchedule(value['cron-pattern']);
								}
							}

							if (attributes?.ZxBackup_DestPath) {
								const value = attributes?.ZxBackup_DestPath?.value;
								if (value) {
									setBackupDestPath(value);
								}
							}
						}

						if (data && data?.properties) {
							const properties = data?.properties;
							if (properties?.latest_smart_scan?.numDeletedItems) {
								const value = properties?.latest_smart_scan?.numDeletedItems;
								if (value) {
									setKeepDeletedItemInBackup(value);
								}
							}

							if (properties?.latest_smart_scan?.numDeletedAccounts) {
								const value = properties?.latest_smart_scan?.numDeletedAccounts;
								if (value) {
									setKeepDeletedAccountsInBackup(value);
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
				<Row mainAlignment="flex-start" padding={{ all: 'large' }}>
					<Text size="medium" weight="bold">
						{t('backup.server_configuration', 'Server Configuration')}
					</Text>
				</Row>
				<Divider />
				<Container
					mainAlignment="flex-start"
					crossAlignment="flex-end"
					style={{ overflow: 'auto' }}
					padding={{ all: 'large' }}
					height="calc(100vh - 150px)"
				>
					<Container
						mainAlignment="flex-start"
						crossAlignment="flex-end"
						padding={{ top: 'medium' }}
						height="fit"
					>
						<Text size="medium" weight="bold">
							{t('backup.the_service_is_stopped', 'The service is stopped')}
						</Text>
					</Container>

					<Container
						mainAlignment="flex-start"
						crossAlignment="flex-end"
						padding={{ top: 'medium' }}
						height="fit"
					>
						<Button
							type="outlined"
							label={t('backup.start_service', 'Start service')}
							color="primary"
							width="fit"
							height={44}
						/>
					</Container>

					<Container
						mainAlignment="flex-start"
						crossAlignment="flex-start"
						padding={{ top: 'extralarge' }}
						height="fit"
					>
						<Text size="medium" weight="bold">
							{t('backup.general', 'General')}
						</Text>
					</Container>

					<ListRow>
						<Container
							padding={{ top: 'large' }}
							mainAlignment="flex-start"
							crossAlignment="flex-start"
						>
							<Switch
								label={t(
									'backup.module_is_enabled_at_startup',
									'This module is enabled at startup'
								)}
								value={moduleEnableStartup}
								onClick={(): void => setModuleEnableStartup(!moduleEnableStartup)}
							/>
						</Container>
						<Container padding={{ top: 'large' }}>
							<Switch
								label={t('backup.enable_realtime_scanner', 'Enable RealTime Scanner')}
								value={enableRealtimeScanner}
								onClick={(): void => setEnableRealtimeScanner(!enableRealtimeScanner)}
							/>
						</Container>
						<Container padding={{ top: 'large' }}>
							<Switch
								label={t('backup.run_smartscan_at_startup', 'Run the Smartscan at startup')}
								value={runSmartScanStartup}
								onClick={(): void => setRunSmartScanStartup(!runSmartScanStartup)}
							/>
						</Container>
					</ListRow>

					<ListRow>
						<Container padding={{ top: 'large' }}>
							<Button
								type="outlined"
								label={t('backup.initialize_backup', 'Initialize Backup')}
								color="primary"
								icon="PowerOutline"
								iconPlacement="right"
								height={36}
								width="100%"
							/>
						</Container>
					</ListRow>

					<ListRow>
						<Container padding={{ top: 'large' }}>
							<Input
								label={t('backup.local_volume', 'Local Volume')}
								value={backupDestPath}
								background="gray5"
								onChange={(e: any): any => {
									setBackupDestPath(e.target.value);
								}}
							/>
						</Container>
					</ListRow>

					<ListRow>
						<Container padding={{ top: 'large' }}>
							<Input
								label={t('backup.space_threshold_mb', 'Space Threshold (MB)')}
								value={spaceThreshold}
								background="gray5"
								onChange={(e: any): any => {
									setSpaceThreshold(e.target.value);
								}}
							/>
						</Container>
					</ListRow>

					<ListRow>
						<Container padding={{ top: 'large' }}>
							<Button
								type="outlined"
								label={t('backup.set_external_volume', 'Set external volume')}
								color="primary"
								icon="HardDriveOutline"
								iconPlacement="right"
								height={36}
								width="100%"
							/>
						</Container>
					</ListRow>

					<ListRow>
						<Container
							mainAlignment="flex-start"
							crossAlignment="flex-start"
							orientation="horizontal"
							padding={{ top: 'large' }}
						>
							<Divider />
						</Container>
					</ListRow>

					<Container
						mainAlignment="flex-start"
						crossAlignment="flex-start"
						padding={{ top: 'large' }}
						height="fit"
					>
						<Text size="medium" weight="bold">
							{t('backup.smart_scan_configuration', 'SmartScan Configuration')}
						</Text>
					</Container>

					<Container
						mainAlignment="flex-start"
						crossAlignment="flex-start"
						padding={{ top: 'large' }}
						height="fit"
					>
						<Switch
							label={t('backup.schedule_smartscan', 'Schedule Smartscan')}
							value={isScheduleSmartscan}
							onClick={(): void => setIsScheduleSmartScan(!isScheduleSmartscan)}
						/>
					</Container>

					<ListRow>
						<Container padding={{ top: 'large' }}>
							<Input
								label={t('backup.schedule', 'Schedule')}
								background="gray5"
								value={scheduleSmartScan}
								onChange={(e: any): any => {
									setScheduleSmartScan(e.target.value);
								}}
							/>
						</Container>
					</ListRow>

					<ListRow>
						<Container padding={{ top: 'large' }}>
							<Button
								type="outlined"
								label={t('backup.force_start_smartscan_now', 'Force start smartscan now')}
								color="primary"
								icon="PowerOutline"
								iconPlacement="right"
								height={36}
								width="100%"
							/>
						</Container>
					</ListRow>

					<ListRow>
						<Container
							mainAlignment="flex-start"
							crossAlignment="flex-start"
							orientation="horizontal"
							padding={{ top: 'large' }}
						>
							<Divider />
						</Container>
					</ListRow>

					<Container
						mainAlignment="flex-start"
						crossAlignment="flex-start"
						padding={{ top: 'large' }}
						height="fit"
					>
						<Text size="medium" weight="bold">
							{t('backup.data_retention_policies', 'Data Retention Policies')}
						</Text>
					</Container>

					<ListRow>
						<Container
							padding={{ top: 'large' }}
							mainAlignment="flex-start"
							crossAlignment="flex-start"
						>
							<Switch
								label={t(
									'backup.schedule_automatic_retention_policies',
									'Schedule automatic retention policies'
								)}
								value={scheduleAutomaticRetentionPolicy}
								onClick={(): void =>
									setScheduleAutomaticRetentionPolicy(!scheduleAutomaticRetentionPolicy)
								}
							/>
						</Container>
					</ListRow>

					<ListRow>
						<Container padding={{ top: 'large' }}>
							<Input
								label={t('backup.schedule', 'Schedule')}
								background="gray5"
								value={retentionPolicySchedule}
								onChange={(e: any): any => {
									setRetentionPolicySchedule(e.target.value);
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
							width="35%"
						>
							<Input
								label={t('backup.keep_deleted_item_in_backup', 'Keep deleted items in the backup')}
								background="gray5"
								value={keepDeletedItemInBackup}
								onChange={(e: any): any => {
									setKeepDeletedItemInBackup(e.target.value);
								}}
							/>
						</Container>
						<Container
							mainAlignment="flex-start"
							crossAlignment="flex-start"
							orientation="horizontal"
							padding={{ top: 'large', right: 'large' }}
							width="15%"
						>
							<Input
								label={t('backup.range', 'Range')}
								background="gray5"
								value={t('label.days', 'Days')}
							/>
						</Container>
						<Container
							mainAlignment="flex-start"
							crossAlignment="flex-start"
							orientation="horizontal"
							padding={{ top: 'large', right: 'large' }}
							width="35%"
						>
							<Input
								label={t(
									'backup.keep_deleted_account_in_the_backup',
									'Keep deleted account in the backup'
								)}
								background="gray5"
								value={keepDeletedAccountsInBackup}
								onChange={(e: any): any => {
									setKeepDeletedAccountsInBackup(e.target.value);
								}}
							/>
						</Container>
						<Container
							mainAlignment="flex-start"
							crossAlignment="flex-start"
							orientation="horizontal"
							padding={{ top: 'large' }}
							width="15%"
						>
							<Input
								label={t('backup.range', 'Range')}
								background="gray5"
								value={t('label.days', 'Days')}
							/>
						</Container>
					</ListRow>
					<ListRow>
						<Container padding={{ top: 'large' }}>
							<Button
								type="outlined"
								label={t('backup.force_backup_purge_now', 'Force backup purge now')}
								color="primary"
								icon="PowerOutline"
								iconPlacement="right"
								height={36}
								width="100%"
							/>
						</Container>
					</ListRow>
				</Container>
			</Container>
		</Container>
	);
};
export default BackupConfiguration;
