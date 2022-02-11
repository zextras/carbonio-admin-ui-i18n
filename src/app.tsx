/*
 * SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import React, { FC, useEffect } from 'react';
import {
	addRoute,
	addSettingsView,
	addBoardView,
	addUtilityView,
	addSecondaryAccessoryView,
	addPrimaryAccessoryView,
	setAppContext,
	registerActions,
	ACTION_TYPES,
	getBridgedFunctions
} from '@zextras/carbonio-shell-ui';
import { Container, Text } from '@zextras/carbonio-design-system';
import { useTranslation } from 'react-i18next';
import { map } from 'lodash';
import { MAIN_ROUTE, SECONDARY_ROUTE } from './constants';
import SecondaryRouteIconView from './views/primary-bar/secondary-route';

const PlaceholderComponent: FC = (props) => (
	<Container mainAlignment="flex-start" crossAlignment="flex-start" padding={{ all: 'medium' }}>
		<Text>Placeholder Component</Text>
		{map(props, (p, k) => (
			<Text>{`${k}: ${p}`}</Text>
		))}
	</Container>
);

const App: FC = () => {
	const [t] = useTranslation();
	useEffect(() => {
		const label1 = t('label.app_name', 'Example App');
		const label2 = t('label.secondary_app', 'Example Secondary');
		addRoute({
			route: MAIN_ROUTE,
			position: 1,
			visible: true,
			label: label1,
			primaryBar: 'CubeOutline',
			secondaryBar: PlaceholderComponent,
			appView: PlaceholderComponent
		});
		addRoute({
			route: SECONDARY_ROUTE,
			position: 2,
			visible: true,
			label: label2,
			primaryBar: SecondaryRouteIconView,
			secondaryBar: PlaceholderComponent,
			appView: PlaceholderComponent
		});
		addSettingsView({
			route: MAIN_ROUTE,
			label: label1,
			component: PlaceholderComponent
		});
		addSettingsView({
			route: SECONDARY_ROUTE,
			label: label2,
			component: PlaceholderComponent
		});
		addBoardView({
			route: MAIN_ROUTE,
			component: PlaceholderComponent
		});
		addBoardView({
			route: SECONDARY_ROUTE,
			component: PlaceholderComponent
		});
		addUtilityView({
			id: 'utility-1',
			blacklistRoutes: [MAIN_ROUTE],
			button: 'AdminPanelOutline',
			label: t('label.utility_view', 'Test utility view 1'),
			component: PlaceholderComponent
		});
		addUtilityView({
			id: 'utility-2',
			blacklistRoutes: [SECONDARY_ROUTE],
			button: 'AwardOutline',
			label: t('label.utility_view2', 'Test utility view 2'),
			component: PlaceholderComponent
		});
		addUtilityView({
			id: 'utility-3',
			whitelistRoutes: [SECONDARY_ROUTE],
			button: 'ColorPickerOutline',
			label: t('label.utility_view', 'Test utility view 1'),
			component: PlaceholderComponent
		});
		addUtilityView({
			id: 'utility-4',
			whitelistRoutes: [SECONDARY_ROUTE],
			button: 'CrownOutline',
			label: t('label.utility_view2', 'Test utility view 2'),
			component: PlaceholderComponent
		});
		addUtilityView({
			id: 'utility-5',
			button: 'CompassOutline',
			label: t('label.utility_view3', 'Test utility view 3'),
			component: PlaceholderComponent
		});
		addSecondaryAccessoryView({
			id: 'secondary-1',
			blacklistRoutes: [SECONDARY_ROUTE],
			component: PlaceholderComponent
		});
		addSecondaryAccessoryView({
			id: 'secondary-2',
			blacklistRoutes: [MAIN_ROUTE],
			component: PlaceholderComponent
		});
		addPrimaryAccessoryView({
			id: 'primary-1',
			blacklistRoutes: [SECONDARY_ROUTE],
			component: 'CodeDownloadOutline'
		});
		addPrimaryAccessoryView({
			id: 'primary-2',
			blacklistRoutes: [MAIN_ROUTE],
			component: 'ColorPaletteOutline'
		});
		setAppContext({ hello: 'world' });
	}, [t]);

	useEffect(() => {
		registerActions({
			id: 'new-example',
			type: ACTION_TYPES.NEW,
			action: (route) => ({
				id: 'new-example',
				label: t('label.example_new', 'New Example'),
				icon: 'CubeOutline',
				click: (): void => {
					getBridgedFunctions().addBoard(MAIN_ROUTE);
				},
				disabled: false,
				primary: true,
				group: MAIN_ROUTE,
				type: ACTION_TYPES.NEW
			})
		});
	}, [t]);

	return null;
};

export default App;
