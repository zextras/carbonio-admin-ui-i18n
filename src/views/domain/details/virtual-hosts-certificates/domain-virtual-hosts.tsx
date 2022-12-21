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
import { useTranslation } from 'react-i18next';
import _ from 'lodash';
import { ZIMBRA_DOMAIN_NAME, ZIMBRA_ID, ZIMBRA_VIRTUAL_HOSTNAME } from '../../../../constants';
import { modifyDomain } from '../../../../services/modify-domain-service';
import { useDomainStore } from '../../../../store/domain/store';
import logo from '../../../../assets/helmet_logo.svg';
import { RouteLeavingGuard } from '../../../ui-extras/nav-guard';
import ListRow from '../../../list/list-row';
import { AbsoluteContainer } from '../../../components/styled';
import LoadVerifyCertificateWizard from './load-verify-certificate-wizard';

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
	const domainInformation = useDomainStore((state) => state.domain?.a);
	const setDomain = useDomainStore((state) => state.setDomain);
	const [toggleLoadVerifyCertWizard, setToggleLoadVerifyCertWizard] = useState(false);
	const [viewCertiToggle, setViewCertiToggle] = useState(false);

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

	return (
		<Container padding={{ all: 'large' }} background="gray6" mainAlignment="flex-start">
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
					{!viewCertiToggle && (
						<>
							<Padding value="large">
								<Padding vertical="small">
									<Row takeAvwidth="fill" mainAlignment="flex-start" width="100%">
										<Paragraph size="medium" color="secondary">
											{t(
												'label.virtual_host_info_msg',
												'Virtual hosts allow the system to establish a default domain for a user login.'
											)}
										</Paragraph>
									</Row>
									<Row takeAvwidth="fill" mainAlignment="flex-start" width="100%">
										<Paragraph size="medium" color="secondary">
											{t(
												'label.virtual_host_user_msg_1',
												'Any user that logs in while using a URL with one of the hostnames below will be assumed to be in this domain, domain1.local.'
											)}
										</Paragraph>
									</Row>
									<Row takeAvwidth="fill" mainAlignment="flex-start" width="100%">
										<Paragraph size="medium" color="secondary">
											{t(
												'label.virtual_host_note',
												'Please note, that removal of a virtual host takes effect only after mailbox server is restarted.'
											)}
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
												type="outlined"
												label={t('label.add', 'Add')}
												icon="Plus"
												color="primary"
												disabled={addButtonDisabled}
												height="44px"
												onClick={addVirtualHost}
											/>
										</Padding>
										<Padding left="large">
											<Button
												type="outlined"
												label={t('label.remove', 'Remove')}
												icon="Close"
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
											<Row takeAvwidth="fill" mainAlignment="center" width="100%">
												<Text size="large" color="secondary" weight="regular">
													{t('label.no_virtual_host_msg', 'There aren’t virtual hosts here.')}
												</Text>
											</Row>
											<Row takeAvwidth="fill" mainAlignment="center" width="100%">
												<Text size="large" color="secondary" weight="regular">
													{t(
														'label.virtual_host_enable_info_msg',
														'Click to ADD button to enabled new one.'
													)}
												</Text>
											</Row>
										</Padding>
									</Container>
								)}
							</Padding>
							<Row width="100%" padding={{ right: 'large' }}>
								<Divider color="gray2" />
							</Row>
						</>
					)}
					<Container
						padding={{ right: 'large', top: 'large', bottom: 'small' }}
						height="fit"
						crossAlignment="flex-start"
						background="gray6"
						className="ff"
					>
						{!viewCertiToggle && (
							<Row
								padding={{ top: 'extralarge' }}
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
											type="outlined"
											label={t('label.download_pdf', 'DOWNLOAD PDF')}
											color="primary"
											disabled={addButtonDisabled}
											height="44px"
											onClick={(): void => {
												console.log('download pdf clicked');
											}}
										/>
									</Padding>
									<Padding left="large">
										<Button
											type="outlined"
											label={t('label.load_and_verify_certificate', 'LOAD AND VERIFY CERTIFICATE')}
											color="primary"
											height="44px"
											onClick={handleLoadAndVerifyCert}
										/>
									</Padding>
									<Padding left="large">
										<Button
											type="outlined"
											label={t('label.remove', 'Remove')}
											color="error"
											height="44px"
											disabled={removeButtonDisabled}
											onClick={removeVirtualHost}
										/>
									</Padding>
								</Row>
							</Row>
						)}
						<Row mainAlignment="flex-start" width="100%" padding={{ top: 'large' }}>
							<ListRow>
								<Container padding={{ right: 'small' }}>
									<Input
										background="gray6"
										label={t('label.subject_name', 'Subject Name')}
										name="subject_name"
										value="mail.zextras.com"
									/>
								</Container>
								<Container padding={{ left: 'small' }}>
									<Input
										background="gray6"
										label={t('label.key_id', 'Key ID')}
										name="key_id"
										value="62:33:5D:28:9B:2C:AF:30:02:5C:DA:E0:85:D8:3B:E0:18:B6:13:4E"
										CustomIcon={(): any => <Icon icon="CopyOutline" size="large" color="gray0" />}
									/>
								</Container>
							</ListRow>
						</Row>
						<Row width="100%" padding={{ top: 'large', bottom: 'small' }}>
							<ListRow>
								<Container padding={{ right: 'small' }}>
									<Input
										background="gray6"
										label={t('label.DNS_name', 'DNS Name')}
										name="DNS_name"
										value="autodiscover.zextras.com"
									/>
								</Container>
								<Container padding={{ left: 'small' }}>
									<Input
										background="gray6"
										label={t('label.DNS_name', 'DNS Name')}
										name="DNS_name"
										value="mail.zextras.com"
									/>
								</Container>
							</ListRow>
						</Row>
						<Row
							crossAlignment="flex-start"
							padding={{ top: 'large' }}
							style={{ cursor: 'pointer' }}
							onClick={(): void => {
								setViewCertiToggle(!viewCertiToggle);
							}}
						>
							<Text
								size="small"
								color="primary"
								weight="bold"
								style={{ textDecoration: 'underline' }}
							>
								{!viewCertiToggle
									? t('label.view_full_certificate', 'View Full Certificate')
									: t('label.back_to_main_page', 'Back')}
							</Text>
							<Icon
								icon={!viewCertiToggle ? 'ChevronDownOutline' : 'ChevronUpOutline'}
								size="medium"
								color="primary"
							/>
						</Row>
						{viewCertiToggle && (
							<>
								<Row
									mainAlignment="flex-start"
									padding={{ top: 'extralarge', bottom: 'large' }}
									width="100%"
								>
									<Text size="medium" color="gray0" weight="bold">
										{t('label.validity', 'Validity')}
									</Text>
									<Row width="100%" mainAlignment="flex-start" padding={{ top: 'large' }}>
										<ListRow>
											<Container padding={{ right: 'small' }}>
												<Input
													background="gray6"
													label={t('label.valid_from', 'valid from (not before)')}
													name="valid_from"
													value="Wed, 03 Aug 2022 11:37:53 GMT"
												/>
											</Container>
											<Container padding={{ left: 'small' }}>
												<Input
													background="gray6"
													label={t('label.valid_until', 'valid until (not after)')}
													name="valid_until"
													value="Tue, 01 Nov 2022 11:37:52 GMT"
												/>
											</Container>
										</ListRow>
									</Row>
								</Row>
								<Row
									mainAlignment="flex-start"
									padding={{ top: 'extralarge', bottom: 'large' }}
									width="100%"
								>
									<Text size="medium" color="gray0" weight="bold">
										{t('label.issuign_authority', 'Issuing Authority')}
									</Text>
									<Row width="100%" padding={{ top: 'large' }}>
										<ListRow>
											<Container padding={{ right: 'small' }}>
												<Input
													background="gray6"
													label={t('label.country', 'Country')}
													name="country"
													value="United States (US)"
												/>
											</Container>
											<Container padding={{ left: 'small' }}>
												<Input
													background="gray6"
													label={t('label.key_id', 'Key ID')}
													name="key_id"
													value="14:2E:B3:17:B7:58:56:CB:AE:50:09:40:E6:1F:AF:9D:8B:14:C2:C6"
													CustomIcon={(): any => (
														<Icon icon="CopyOutline" size="large" color="gray0" />
													)}
												/>
											</Container>
										</ListRow>
									</Row>
									<Row width="100%" padding={{ top: 'large' }}>
										<ListRow>
											<Container padding={{ right: 'small' }}>
												<Input
													background="gray6"
													label={t('label.company', 'Company')}
													value="Let’s Encrypt"
												/>
											</Container>
											<Container padding={{ left: 'small' }}>
												<Input
													background="gray6"
													label={t('label.method_address', 'Method Address')}
													value="http://r3.o.lencr.org - Online Certificate Status Protocol (OCSP)"
												/>
											</Container>
										</ListRow>
									</Row>
									<Row width="100%" padding={{ top: 'large' }}>
										<ListRow>
											<Container padding={{ right: 'small' }}>
												<Input
													background="gray6"
													label={t('label.company_name', 'Common Name')}
													value="R3"
												/>
											</Container>
											<Container padding={{ left: 'small' }}>
												<Input
													background="gray6"
													label={t('label.method_address', 'Method Address')}
													value="http://r3.i.lencr.org - CA Issuers"
												/>
											</Container>
										</ListRow>
									</Row>
								</Row>
								<Row
									mainAlignment="flex-start"
									padding={{ top: 'extralarge', bottom: 'large' }}
									width="100%"
								>
									<Text size="medium" color="gray0" weight="bold">
										{t('label.public_key_information', 'Public Key Information')}
									</Text>
									<Row width="100%" padding={{ top: 'large' }}>
										<ListRow>
											<Container padding={{ right: 'small' }}>
												<Input
													background="gray6"
													label={t('label.algorythm', 'Algorythm')}
													value="RSA"
												/>
											</Container>
											<Container padding={{ left: 'small' }}>
												<Input
													background="gray6"
													label={t('label.key_size', 'Key Size')}
													value="2048"
												/>
											</Container>
										</ListRow>
									</Row>
									<Row width="100%" padding={{ top: 'large' }}>
										<ListRow>
											<Container padding={{ right: 'small' }}>
												<Input
													background="gray6"
													label={t('label.exponent', 'Exponent')}
													value="65537"
												/>
											</Container>
											<Container padding={{ left: 'small' }}>
												<Input
													background="gray6"
													label={t('label.module', 'Module')}
													value="65537655376553765537655376553765537655376553765537"
													CustomIcon={(): any => (
														<Icon icon="CopyOutline" size="large" color="gray0" />
													)}
												/>
											</Container>
										</ListRow>
									</Row>
								</Row>
								<Row
									mainAlignment="flex-start"
									padding={{ top: 'extralarge', bottom: 'large' }}
									width="100%"
								>
									<Text size="medium" color="gray0" weight="bold">
										{t('label.included_sct', 'Included SCT')}
									</Text>
									<Row width="100%" padding={{ top: 'large' }}>
										<ListRow>
											<Container padding={{ right: 'small' }}>
												<Input
													background="gray6"
													label={t('label.id_log', 'ID Log')}
													value="29:79:BE:F0:9E:39:39:21:F0:56:73:9F:63:A5:77:E5:BE:57:7D:9C:60:0A:F8:F9:4D:5D:26:5C:25:5D:C7:84"
													CustomIcon={(): any => (
														<Icon icon="CopyOutline" size="large" color="gray0" />
													)}
												/>
											</Container>
											<Container padding={{ left: 'small' }}>
												<Input
													background="gray6"
													label={t('label.id_log', 'ID Log')}
													value="29:79:BE:F0:9E:39:39:21:F0:56:73:9F:63:A5:77:E5:BE:57:7D:9C:60:0A:F8:F9:4D:5D:26:5C:25:5D:C7:84"
													CustomIcon={(): any => (
														<Icon icon="CopyOutline" size="large" color="gray0" />
													)}
												/>
											</Container>
										</ListRow>
									</Row>
									<Row width="100%" padding={{ top: 'large' }}>
										<ListRow>
											<Container padding={{ right: 'small' }}>
												<Input
													background="gray6"
													label={t('label.name', 'Name')}
													value={`Google “Argon2022”`}
												/>
											</Container>
											<Container padding={{ left: 'small' }}>
												<Input
													background="gray6"
													label={t('label.name', 'Name')}
													value={`Cloudflare “Nimbus2022”`}
												/>
											</Container>
										</ListRow>
									</Row>
									<Row width="100%" padding={{ top: 'large' }}>
										<ListRow>
											<Container padding={{ right: 'small' }}>
												<Input
													background="gray6"
													label={t('label.signature_algorythm', 'Signature Algorythm')}
													value="SHA-256 ECDSA"
												/>
											</Container>
											<Container padding={{ left: 'small' }}>
												<Input
													background="gray6"
													label={t('label.signature_algorythm', 'Signature Algorythm')}
													value="SHA-256 ECDSA"
												/>
											</Container>
										</ListRow>
									</Row>
									<Row width="100%" padding={{ top: 'large' }}>
										<ListRow>
											<Container padding={{ right: 'small' }}>
												<Input background="gray6" label={t('label.version', 'Version')} value="1" />
											</Container>
											<Container padding={{ left: 'small' }}>
												<Input background="gray6" label={t('label.version', 'Version')} value="1" />
											</Container>
										</ListRow>
									</Row>
									<Row width="100%" padding={{ top: 'large' }}>
										<ListRow>
											<Container padding={{ right: 'small' }}>
												<Input
													background="gray6"
													label={t('label.date_Time', 'Date & Time')}
													value="Wed, 03 Aug 2022 12:37:53 GMT"
												/>
											</Container>
											<Container padding={{ left: 'small' }}>
												<Input
													background="gray6"
													label={t('label.date_Time', 'Date & Time')}
													value="Wed, 03 Aug 2022 12:37:53 GMT"
												/>
											</Container>
										</ListRow>
									</Row>
								</Row>
								<Row
									mainAlignment="flex-start"
									padding={{ top: 'extralarge', bottom: 'large' }}
									width="100%"
								>
									<Text size="medium" color="gray0" weight="bold">
										{t('label.public_key_information', 'Public Key Information')}
									</Text>
									<Row width="100%" padding={{ top: 'large' }}>
										<ListRow>
											<Container padding={{ right: 'small' }}>
												<Input
													background="gray6"
													label={t('label.criteria', 'Criteria')}
													value="Certificate Type ( 2.23.140.1.2.1 )"
												/>
											</Container>
											<Container padding={{ left: 'small' }}>
												<Input
													background="gray6"
													label={t('label.value', 'Value')}
													value="1.3.6.1.4.1.44947.1.1.1"
												/>
											</Container>
										</ListRow>
									</Row>
									<Row width="100%" padding={{ top: 'large' }}>
										<ListRow>
											<Container padding={{ right: 'small' }}>
												<Input
													background="gray6"
													label={t('label.value', 'Value')}
													value="Domain Validation"
												/>
											</Container>
											<Container padding={{ left: 'small' }}>
												<Input
													background="gray6"
													label={t('label.quantifier', 'Quantifier')}
													value="Practices Statement ( 1.3.6.1.5.5.7.2.1 )"
												/>
											</Container>
										</ListRow>
									</Row>
									<Row width="100%" padding={{ top: 'large' }}>
										<ListRow>
											<Container padding={{ right: 'small' }}>
												<Input
													background="gray6"
													label={t('label.criteria', 'Criteria')}
													value="Statement Identifier ( 1.3.6.1.4.1 )"
												/>
											</Container>
											<Container padding={{ left: 'small' }}>
												<Input
													background="gray6"
													label={t('label.value', 'Value')}
													value="http://cps.letsencrypt.org"
													CustomIcon={(): any => (
														<Icon icon="DownloadOutline" size="large" color="gray0" />
													)}
												/>
											</Container>
										</ListRow>
									</Row>
								</Row>
								<Row
									mainAlignment="flex-start"
									padding={{ top: 'extralarge', bottom: 'large' }}
									width="100%"
								>
									<Text size="medium" color="gray0" weight="bold">
										{t('label.others', 'Others')}
									</Text>
									<Row width="100%" padding={{ top: 'large' }}>
										<ListRow>
											<Container padding={{ right: 'small' }}>
												<Input
													background="gray6"
													label={t('label.serial_number', 'Serial Number')}
													value="03:63:D3:7F:A7:E3:01:09:D8:BE:E8:B5:38:5D:D0:E6:83:F1"
													CustomIcon={(): any => (
														<Icon icon="CopyOutline" size="large" color="gray0" />
													)}
												/>
											</Container>
											<Container padding={{ left: 'small' }}>
												<Input background="gray6" label={t('label.version', 'Version')} value="3" />
											</Container>
										</ListRow>
									</Row>
									<Row width="100%" padding={{ top: 'large' }}>
										<ListRow>
											<Container padding={{ right: 'small' }}>
												<Input
													background="gray6"
													label={t('label.algorhytm_signature', 'Algorhytm Signature')}
													value="SHA-256 with RSA Encryption"
												/>
											</Container>
											<Container padding={{ left: 'small' }}>
												<Input
													background="gray6"
													label={t('label.downloads', 'Downloads')}
													value="PEM (certificato) PEM (catena)"
													CustomIcon={(): any => (
														<Icon icon="DownloadOutline" size="large" color="gray0" />
													)}
												/>
											</Container>
										</ListRow>
									</Row>
								</Row>
								<Row
									mainAlignment="flex-start"
									padding={{ top: 'extralarge', bottom: 'large' }}
									width="100%"
								>
									<Text size="medium" color="gray0" weight="bold">
										{t('label.base_limitations', 'Base Limitations')}
									</Text>
									<Row width="100%" padding={{ top: 'large' }}>
										<Input
											background="gray6"
											label={t('label.authority_certification', 'Authority Certification')}
											value="No"
										/>
									</Row>
								</Row>
								<Row
									mainAlignment="flex-start"
									padding={{ top: 'extralarge', bottom: 'large' }}
									width="100%"
								>
									<Text size="medium" color="gray0" weight="bold">
										{t('label.key_usage_scopes', 'Key Usage Scopes')}
									</Text>
									<Row width="100%" padding={{ top: 'large' }}>
										<Input
											background="gray6"
											label={t('label.usages', 'Usages')}
											value="Digital Signature, Key Encipherment"
										/>
									</Row>
								</Row>
								<Row
									mainAlignment="flex-start"
									padding={{ top: 'extralarge', bottom: 'large' }}
									width="100%"
								>
									<Text size="medium" color="gray0" weight="bold">
										{t('label.digital_imprints', 'Digital Imprints')}
									</Text>
									<Row width="100%" padding={{ top: 'large' }}>
										<Input
											background="gray6"
											label={t('label.SHA-256', 'SHA-256')}
											value="68:2C:7A:1C:D8:6A:19:4E:BE:E3:60:69:CB:FD:A9:33:7C:CC:06:EE:B7:94:82:57:4F:62:E1:5C:CA:19:8D:AB"
											CustomIcon={(): any => <Icon icon="CopyOutline" size="large" color="gray0" />}
										/>
									</Row>
									<Row width="100%" padding={{ top: 'large' }}>
										<Input
											background="gray6"
											label={t('label.SHA-1', 'SHA-1')}
											value="AC:C1:8A:2F:72:2F:A6:C1:1C:F3:9D:10:83:7B:2C:FD:C4:BE:E5:4A"
											CustomIcon={(): any => <Icon icon="CopyOutline" size="large" color="gray0" />}
										/>
									</Row>
								</Row>
								<Row
									mainAlignment="flex-start"
									padding={{ top: 'extralarge', bottom: 'large' }}
									width="100%"
								>
									<Text size="medium" color="gray0" weight="bold">
										{t('label.extended_key_usage', 'Extended Key Usage')}
									</Text>
									<Row width="100%" padding={{ top: 'large' }}>
										<Input
											background="gray6"
											label={t('label.usages', 'Usages')}
											value="Server Authentication, Client Authentication"
										/>
									</Row>
								</Row>
							</>
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
