/*
 * SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import {
	Container,
	Row,
	Text,
	Divider,
	Button,
	Switch,
	Input
} from '@zextras/carbonio-design-system';
import { useParams } from 'react-router-dom';
import ListRow from '../../list/list-row';

const BackupConfiguration: FC = () => {
	const { operation, server }: { operation: string; server: string } = useParams();
	const [t] = useTranslation();
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
						<Container padding={{ top: 'large' }}>
							<Switch
								label={t(
									'backup.module_is_enabled_at_startup',
									'This module is enabled at startup'
								)}
							/>
						</Container>
						<Container padding={{ top: 'large' }}>
							<Switch label={t('backup.enable_realtime_scanner', 'Enable RealTime Scanner')} />
						</Container>
						<Container padding={{ top: 'large' }}>
							<Switch
								label={t('backup.run_smartscan_at_startup', 'Run the Smartscan at startup')}
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
							<Input label={t('backup.local_volume', 'Local Volume')} background="gray5" />
						</Container>
					</ListRow>

					<ListRow>
						<Container padding={{ top: 'large' }}>
							<Input
								label={t('backup.space_threshold_mb', 'Space Threshold (MB)')}
								background="gray5"
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
						<Switch label={t('backup.schedule_smartscan', 'Schedule Smartscan')} />
					</Container>

					<ListRow>
						<Container padding={{ top: 'large' }}>
							<Input label={t('backup.schedule', 'Schedule')} background="gray5" />
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
							/>
						</Container>
					</ListRow>

					<ListRow>
						<Container padding={{ top: 'large' }}>
							<Input label={t('backup.schedule', 'Schedule')} background="gray5" />
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
								backgroundColor="gray5"
								borderColor="gray3"
							/>
						</Container>
						<Container
							mainAlignment="flex-start"
							crossAlignment="flex-start"
							orientation="horizontal"
							padding={{ top: 'large', right: 'large' }}
							width="15%"
						>
							<Input label={t('backup.range', 'Range')} background="gray5" />
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
							/>
						</Container>
						<Container
							mainAlignment="flex-start"
							crossAlignment="flex-start"
							orientation="horizontal"
							padding={{ top: 'large' }}
							width="15%"
						>
							<Input label={t('backup.range', 'Range')} background="gray5" />
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
