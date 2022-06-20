/*
 * SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import React, { FC, useMemo, useState } from 'react';
import styled from 'styled-components';
import {
	Container,
	Row,
	IconButton,
	Divider,
	Padding,
	Input,
	Table,
	Text,
	Select,
	Switch,
	ChipInput
} from '@zextras/carbonio-design-system';
import { useTranslation } from 'react-i18next';
import ListRow from '../../list/list-row';
import Paginig from '../../components/paging';

const MailingListDetailContainer = styled(Container)`
	z-index: 10;
	position: absolute;
	top: 43px;
	right: 12px;
	bottom: 0px;
	left: ${'max(calc(100% - 680px), 12px)'};
	transition: left 0.2s ease-in-out;
	height: auto;
	width: auto;
	max-height: 100%;
	overflow: hidden;
	box-shadow: -6px 4px 5px 0px rgba(0, 0, 0, 0.1);
	opacity: '10%;
`;
const MailingListDetailView: FC<any> = ({ selectedMailingList, setShowMailingListDetailView }) => {
	const [t] = useTranslation();
	const [memberOffset, setMemberOffset] = useState<number>(0);
	const [ownerOffset, setOwnerOffset] = useState<number>(0);
	const memberHeaders: any[] = useMemo(
		() => [
			{
				id: 'members',
				label: t('label.members', 'Members'),
				width: '20%',
				bold: true
			},
			{
				id: 'address',
				label: t('label.type', 'Type'),
				width: '20%',
				bold: true
			}
		],
		[t]
	);

	const ownerHeaders: any[] = useMemo(
		() => [
			{
				id: 'owners',
				label: t('label.owners', 'Owners'),
				width: '20%',
				bold: true
			}
		],
		[t]
	);

	return (
		<MailingListDetailContainer background="gray5" mainAlignment="flex-start">
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
					<Text size="medium" overflow="ellipsis" weight="bold">
						{selectedMailingList?.name}
					</Text>
				</Row>
				<Row padding={{ right: 'extrasmall' }}>
					<IconButton
						size="medium"
						icon="CloseOutline"
						onClick={(): void => setShowMailingListDetailView(false)}
					/>
				</Row>
			</Row>
			<Row>
				<Divider color="gray3" />
			</Row>
			<Container
				padding={{ left: 'large' }}
				mainAlignment="flex-start"
				crossAlignment="flex-start"
				height="calc(100% - 64px)"
				background="white"
				style={{ overflow: 'auto' }}
			>
				<Row>
					<Text size="medium" weight="bold" color="gray0">
						{t('domain.list_details', 'List Details')}
					</Text>
				</Row>
				<ListRow>
					<Container padding={{ all: 'small' }}>
						<Input
							label={t('label.displayed_name', 'Displayed Name')}
							value={''}
							background="gray5"
						/>
					</Container>
					<Container padding={{ all: 'small' }}>
						<Input label={t('label.address', 'Address')} value="" background="gray5" />
					</Container>
				</ListRow>
				<ListRow>
					<Container padding={{ all: 'small' }}>
						<Select
							items={[]}
							background="gray5"
							label={t('label.new_subscription_requests', 'New subscriptions requests')}
							showCheckbox={false}
						/>
					</Container>
					<Container padding={{ all: 'small' }}>
						<Select
							items={[]}
							background="gray5"
							label={t('label.unsubscribe_request', 'Unsubscription requests')}
							showCheckbox={false}
						/>
					</Container>
				</ListRow>
				<ListRow>
					<Select
						items={[]}
						background="gray5"
						label={t('label.rights', 'Rights')}
						showCheckbox={false}
					/>
				</ListRow>
				<ListRow>
					<Switch
						value={false}
						label={t('backup.share_manages_to_new_members', 'Share messages to new members')}
					/>
					<Switch
						value={false}
						label={t('backup.this_is_hidden_from_gal', 'This list is hidden from GAL')}
					/>
				</ListRow>
				<ListRow>
					<Container padding={{ all: 'small' }}>
						<Input label={t('label.members', 'Members')} value={''} background="gray5" />
					</Container>
					<Container padding={{ all: 'small' }}>
						<Input
							label={t('label.alias_in_the_list', 'Alias in the List')}
							value=""
							background="gray5"
						/>
					</Container>
				</ListRow>

				<ListRow>
					<Container padding={{ all: 'small' }}>
						<Input
							label={t('label.creation_date', 'Creation Date')}
							value={''}
							background="gray5"
						/>
					</Container>
					<Container padding={{ all: 'small' }}>
						<Input label={t('label.id_lbl', 'ID')} value="" background="gray5" />
					</Container>
				</ListRow>
				<Row>
					<Text size="medium" weight="bold" color="gray0">
						{t('label.manage_list', 'Manage List')}
					</Text>
				</Row>
				<ListRow>
					<ChipInput
						placeholder={t('label.this_list_is_member_of', 'This List is member of')}
						defaultValue={[]}
					/>
				</ListRow>
				<Row takeAvwidth="fill" mainAlignment="flex-start" width="100%">
					<Container
						orientation="vertical"
						mainAlignment="space-around"
						background="gray6"
						height="58px"
					>
						<Row orientation="horizontal" width="100%" padding={{ all: 'large' }}>
							<Row mainAlignment="flex-start" width="30%" crossAlignment="flex-start">
								<Input
									label={t('label.i_am_looking_for_member', 'I’m looking for the member...')}
									value=""
									background="gray5"
								/>
							</Row>
							<Row width="70%" mainAlignment="flex-end" crossAlignment="flex-end">
								<Padding right="medium">
									<IconButton
										iconColor="primary"
										backgroundColor="gray5"
										icon="Plus"
										height={36}
										width={36}
									/>
								</Padding>
								<Padding right="medium">
									<IconButton
										iconColor="gray6"
										backgroundColor="gray5"
										icon="EditAsNewOutline"
										height={36}
										width={36}
										disabled
									/>
								</Padding>
								<IconButton
									iconColor="error"
									backgroundColor="gray5"
									icon="Trash2Outline"
									height={36}
									width={36}
									disabled
								/>
							</Row>
						</Row>
					</Container>
				</Row>
				<ListRow>
					<Container padding={{ all: 'small' }}>
						<Table rows={[]} headers={memberHeaders} showCheckbox={false} />
					</Container>
					<Container padding={{ all: 'small' }}>
						<Table rows={[]} headers={ownerHeaders} showCheckbox={false} />
					</Container>
				</ListRow>
				<ListRow>
					<Container padding={{ all: 'small' }}>
						<Paginig totalItem={1} pageSize={10} setOffset={setMemberOffset} />
					</Container>
					<Container padding={{ all: 'small' }}>
						<Paginig totalItem={1} pageSize={10} setOffset={setOwnerOffset} />
					</Container>
				</ListRow>
				<Row>
					<Text size="medium" weight="bold" color="gray0">
						{t('label.notes', 'Notes')}
					</Text>
				</Row>
				<ListRow>
					<Container padding={{ all: 'small' }}>
						<Input value={''} background="gray5" />
					</Container>
				</ListRow>
			</Container>
		</MailingListDetailContainer>
	);
};
export default MailingListDetailView;
