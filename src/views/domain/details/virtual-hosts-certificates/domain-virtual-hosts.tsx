/*
 * SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import React, { FC, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import {
	Container,
	Row,
	Padding,
	Divider,
	Text,
	Input,
	Paragraph,
	Button,
	Table,
	SnackbarManagerContext,
	Icon
} from '@zextras/carbonio-design-system';
import { Trans, useTranslation } from 'react-i18next';
import _ from 'lodash';
import { soapFetch } from '@zextras/carbonio-shell-ui';
import { jsPDF as Jspdf } from 'jspdf';
import { ZIMBRA_DOMAIN_NAME, ZIMBRA_ID, ZIMBRA_VIRTUAL_HOSTNAME } from '../../../../constants';
import { modifyDomain } from '../../../../services/modify-domain-service';
import { useDomainStore } from '../../../../store/domain/store';
import logo from '../../../../assets/helmet_logo.svg';
import logoGardian from '../../../../assets/gardian.svg';
import { RouteLeavingGuard } from '../../../ui-extras/nav-guard';
import { AbsoluteContainer } from '../../../components/styled';
import LoadVerifyCertificateWizard from './load-verify-certificate-wizard';
import Textarea from '../../../components/textarea';

const DomainVirtualHosts: FC = () => {
	const [t] = useTranslation();
	const [selectedRows, setSelectedRows] = useState<any>([]);
	const [addButtonDisabled, setAddButtonDisabled] = useState(true);
	const [removeButtonDisabled, setRemoveButtonDisabled] = useState(true);
	const [virtualHostValue, setVirutalHostValue] = useState('');
	const [items, setItems] = useState<any>([]);
	const [defaultItems, setDefaultItems] = useState<any>([]);
	const [domainName, setDomainName] = useState<string>('');
	const [isDirty, setIsDirty] = useState<boolean>(false);
	const [zimbraId, setZimbraId] = useState('');
	const createSnackbar: any = useContext(SnackbarManagerContext);
	const domainInformation: any = useDomainStore((state) => state.domain?.a);
	const setDomain = useDomainStore((state) => state.setDomain);
	const [toggleLoadVerifyCertWizard, setToggleLoadVerifyCertWizard] = useState(false);
	const [certificateDetails, setCertificateDetails] = useState<Array<any>>([]);

	useEffect(() => {
		if (!!domainInformation && domainInformation.length > 0) {
			const zimbraIdArray = domainInformation.filter((domain: any) => domain.n === ZIMBRA_ID);
			if (zimbraIdArray && zimbraIdArray.length > 0) {
				setZimbraId(zimbraIdArray[0]._content);
			}
			const domainNameArray = domainInformation.filter(
				(domain: any) => domain.n === ZIMBRA_DOMAIN_NAME
			);
			if (domainNameArray && domainNameArray.length > 0) {
				setDomainName(domainNameArray[0]._content);
			}
			const domainVirtualHostArray = domainInformation.filter(
				(domain: any) => domain.n === ZIMBRA_VIRTUAL_HOSTNAME
			);
			if (domainVirtualHostArray && domainVirtualHostArray.length > 0) {
				const virtualHostItems = domainVirtualHostArray.map((domain: any, index: any) => ({
					id: (index + 1)?.toString(),
					columns: [domain._content]
				}));
				setItems(virtualHostItems);
				setDefaultItems(virtualHostItems);
			} else {
				setItems([]);
				setDefaultItems([]);
			}
		}
	}, [domainInformation]);

	useEffect(() => {
		if (!_.isEqual(defaultItems, items)) {
			setIsDirty(true);
		} else {
			setIsDirty(false);
		}
	}, [defaultItems, items]);

	const headers = useMemo(
		() => [
			{
				id: 'hosts',
				label: t('label.virtual_host_name', 'Virtual Host Name'),
				width: '100%',
				bold: true
			}
		],
		[t]
	);

	const addVirtualHost = useCallback((): void => {
		if (virtualHostValue) {
			const lastId = items.length > 0 ? items[items.length - 1]?.id : '0';
			const newId = parseInt(lastId, 10) + 1;
			const item = {
				id: newId?.toString(),
				columns: [virtualHostValue],
				clickable: true
			};
			setItems([...items, item]);
			setAddButtonDisabled(true);
			setVirutalHostValue('');
		}
	}, [virtualHostValue, items]);

	const removeVirtualHost = useCallback((): void => {
		if (selectedRows && selectedRows.length > 0) {
			const filterItems = items.filter((item: any) => !selectedRows.includes(item.id));
			setItems(filterItems);
			setRemoveButtonDisabled(true);
			setSelectedRows([]);
		}
	}, [selectedRows, items]);

	const onCancel = (): void => {
		setItems(defaultItems);
	};

	const onSave = (): void => {
		const body: any = {};
		const attributes: any[] = [];
		body.id = zimbraId;
		body._jsns = 'urn:zimbraAdmin';
		items.forEach((item: any) => {
			attributes.push({
				n: ZIMBRA_VIRTUAL_HOSTNAME,
				_content: item.columns[0]
			});
		});
		if (attributes?.length === 0) {
			attributes.push({
				n: ZIMBRA_VIRTUAL_HOSTNAME,
				_content: ''
			});
		}
		body.a = attributes;
		modifyDomain(body)
			.then((data) => {
				createSnackbar({
					key: 'success',
					type: 'success',
					label: t('label.change_save_success_msg', 'The change has been saved successfully'),
					autoHideTimeout: 3000,
					hideButton: true,
					replace: true
				});
				const domain: any = data?.domain[0];
				if (domain) {
					setDomain(domain);
				}
			})
			.catch((error) => {
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
	};

	const handleLoadAndVerifyCert = (): void => {
		setToggleLoadVerifyCertWizard(!toggleLoadVerifyCertWizard);
	};

	const getAllCertiDetailsAPICall = async (): Promise<any> => {
		const zimbraData = domainInformation.filter((item: any) => item.n === ZIMBRA_DOMAIN_NAME)[0]
			?._content;
		await soapFetch(`GetDomain`, {
			_jsns: 'urn:zimbraAdmin',
			attrs: 'zimbraSSLCertificate,zimbraSSLPrivateKey',
			domain: {
				by: 'name',
				_content: zimbraData
			}
		})
			.then((response: any) => {
				setAddButtonDisabled(false);
				setCertificateDetails(response?.domain[0]?.a);
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
	};

	const downloadPdfHandler = (): any => {
		const content = certificateDetails
			?.map((item: { _content: string }): string => item?._content)
			.join('\n');
		const doc = new Jspdf();

		const bodyContent = doc.splitTextToSize(content, 250);
		const pageHeight = doc.internal.pageSize.getHeight();
		doc.setFontSize(12);

		let y = 15;
		// eslint-disable-next-line no-plusplus
		for (let i = 0; i < bodyContent.length; i++) {
			if (y + 10 > pageHeight) {
				y = 15;
				doc.addPage();
			}
			doc.text(bodyContent[i], 10, y);
			y += 7;
		}
		doc.save(`certificate-${domainName}.pdf`);
	};

	useEffect(() => {
		getAllCertiDetailsAPICall();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [toggleLoadVerifyCertWizard]);

	return (
		<Container padding={{ vertical: 'large' }} background="gray6" mainAlignment="flex-start">
			{toggleLoadVerifyCertWizard && (
				<AbsoluteContainer orientation="vertical" background="gray5">
					<LoadVerifyCertificateWizard setToggleWizard={setToggleLoadVerifyCertWizard} />
				</AbsoluteContainer>
			)}
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
									{t('label.virtual_hosts', 'Virtual Hosts')}
								</Text>
							</Row>
							<Row
								padding={{ all: 'large' }}
								width="50%"
								mainAlignment="flex-end"
								crossAlignment="flex-end"
							>
								<Padding right="small">
									{isDirty && (
										<Button
											label={t('label.cancel', 'Cancel')}
											color="secondary"
											onClick={onCancel}
										/>
									)}
								</Padding>
								{isDirty && (
									<Button label={t('label.save', 'Save')} color="primary" onClick={onSave} />
								)}
							</Row>
						</Row>
					</Container>
					<Divider color="gray2" />
				</Row>
				<Container
					orientation="column"
					crossAlignment="flex-start"
					mainAlignment="flex-start"
					style={{ overflow: 'auto' }}
					width="100%"
					height="calc(100vh - 150px)"
				>
					<Padding value="large">
						<Padding vertical="small">
							<Row takeAvwidth="fill" mainAlignment="flex-start" width="100%">
								<Paragraph size="medium" color="secondary">
									<Trans
										i18nKey="label.virtual_host_msg"
										defaults="Virtual hosts allow the system to establish a default domain for a user login.<br />Any user that logs in while using a URL with one of the hostnames below will be assumed to be in this domain, domain1.local.<br />Please note, that removal of a virtual host takes effect only after mailbox server is restarted."
										components={{ break: <br /> }}
									/>
								</Paragraph>
							</Row>
						</Padding>
						<Padding vertical="large" width="100%">
							<Row takeAvwidth="fill" mainAlignment="flex-start" width="100%" wrap="nowrap">
								<Input
									label={t(
										'label.new_virtual_host_name',
										'Type a new Virtual Host Name and click on “Add +” to add it to the list'
									)}
									background="gray5"
									value={virtualHostValue}
									onChange={(e: any): any => {
										setVirutalHostValue(e.target.value);
										setAddButtonDisabled(false);
									}}
								/>
								<Padding left="large">
									<Button
										type="ghost"
										label={t('label.add', 'Add')}
										color="primary"
										disabled={addButtonDisabled}
										height="44px"
										onClick={addVirtualHost}
									/>
								</Padding>
								<Padding left="large">
									<Button
										type="ghost"
										label={t('label.remove', 'Remove')}
										color="error"
										height="44px"
										disabled={removeButtonDisabled}
										onClick={removeVirtualHost}
									/>
								</Padding>
							</Row>
						</Padding>
						<Table
							rows={items}
							headers={headers}
							selectedRows={selectedRows}
							onSelectionChange={(selected: any): any => {
								setSelectedRows(selected);
								if (selected && selected.length > 0) {
									setRemoveButtonDisabled(false);
								} else {
									setRemoveButtonDisabled(true);
								}
							}}
						/>
						{items.length === 0 && (
							<Container
								background="gray6"
								height="fit-content"
								mainAlignment="center"
								crossAlignment="center"
							>
								<Padding value="57px 0 0 0" width="100%">
									<Row takeAvwidth="fill" mainAlignment="center" width="100%">
										<img src={logo} alt="logo" />
									</Row>
								</Padding>
								<Padding vertical="extralarge" width="100%">
									<Row
										takeAvwidth="fill"
										mainAlignment="center"
										crossAlignment="center"
										width="100%"
									>
										<Text
											size="large"
											color="secondary"
											weight="regular"
											style={{ textAlign: 'center' }}
										>
											<Trans
												i18nKey="label.no_virtual_host_message"
												defaults="There aren’t virtual hosts here.<br />Click to ADD button to enabled new one."
												components={{ break: <br /> }}
											/>
										</Text>
									</Row>
								</Padding>
							</Container>
						)}
					</Padding>
					<Row width="100%" padding={{ horizontal: 'large' }}>
						<Divider color="gray2" />
					</Row>
					<Container
						padding={{ all: 'large' }}
						height="fit"
						crossAlignment="flex-start"
						background="gray6"
						className="ff"
					>
						<Row
							padding={{ top: 'large' }}
							width="100%"
							mainAlignment="space-between"
							crossAlignment="start"
						>
							<Row>
								<Text size="medium" color="gray0" weight="bold">
									{t('label.certificate', 'Certificate')}
								</Text>
							</Row>
							<Row>
								<Padding left="large">
									<Button
										type="ghost"
										label={t('label.download_pdf', 'DOWNLOAD PDF')}
										color="primary"
										disabled={addButtonDisabled}
										height="44px"
										onClick={downloadPdfHandler}
									/>
								</Padding>
								<Padding left="large">
									<Button
										type="ghost"
										label={t('label.load_and_verify_certificate', 'LOAD AND VERIFY CERTIFICATE')}
										color="primary"
										height="44px"
										onClick={handleLoadAndVerifyCert}
									/>
								</Padding>
								<Padding left="large">
									<Button
										type="ghost"
										label={t('label.remove', 'Remove')}
										color="error"
										height="44px"
										disabled={removeButtonDisabled}
										onClick={removeVirtualHost}
									/>
								</Padding>
							</Row>
						</Row>
					</Container>
					<Container
						padding={{ top: 'large', bottom: 'extralarge', horizontal: 'large' }}
						background="gray6"
						mainAlignment="start"
						crossAlignment="start"
					>
						{certificateDetails.length !== 0 ? (
							<Container
								background="gray6"
								padding={{ all: 'large' }}
								width="100%"
								mainAlignment="start"
								crossAlignment="start"
								height="unset"
							>
								<Textarea
									value={certificateDetails?.map(
										(item: { _content: string }): string => item?._content
									)}
									backgroundColor="gray5"
									rows={5}
									readOnly
								/>
							</Container>
						) : (
							<Container orientation="column" crossAlignment="center" mainAlignment="start">
								<Row>
									<img src={logoGardian} alt="logo" />
								</Row>
								<Row
									orientation="vertical"
									crossAlignment="center"
									style={{ textAlign: 'center' }}
									padding={{ top: 'extralarge' }}
									width="53%"
								>
									<Text weight="light" color="#828282" size="large" overflow="break-word">
										<Trans
											i18nKey="label.load_certificate_message"
											defaults="Load a certificates to see its details!<br />Click on the <strong>“LOAD AND VERIFY CERTIFICATE +”</strong> to start"
											components={{ break: <br />, bold: <strong /> }}
										/>
									</Text>
								</Row>
							</Container>
						)}
					</Container>
				</Container>
			</Container>
			<RouteLeavingGuard when={isDirty} onSave={onSave}>
				<Text>
					{t(
						'label.unsaved_changes_line1',
						'Are you sure you want to leave this page without saving?'
					)}
				</Text>
				<Text>{t('label.unsaved_changes_line2', 'All your unsaved changes will be lost')}</Text>
			</RouteLeavingGuard>
		</Container>
	);
};

export default DomainVirtualHosts;
