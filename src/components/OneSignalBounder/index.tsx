import { initOneSignal } from '@/services/base/api';
import { AppModules } from '@/services/base/constant';
import { currentRole, oneSignalClient, oneSignalRole } from '@/utils/ip';
import { useEffect, useState } from 'react';
import { useAuth } from 'react-oidc-context';
import OneSignal from 'react-onesignal';

const OneSignalBounder = (props: { children: React.ReactNode }) => {
	const [oneSignalId, setOneSignalId] = useState<string | null | undefined>();
	const auth = useAuth();
	const iframeSource = AppModules[oneSignalRole].url;

	const getUserIdOnesignal = async () => {
		if (!!oneSignalClient) {
			await OneSignal.init({
				appId: oneSignalClient,
			});
			const id = await OneSignal.getUserId();
			setOneSignalId(id);
		}
	};

	useEffect(() => {
		if (oneSignalRole.valueOf() === currentRole.valueOf()) {
			getUserIdOnesignal();
		} else if (iframeSource) {
			// Subscription flow is handled by the main site when needed.
		}
	}, [iframeSource]);

	useEffect(() => {
		if (oneSignalId && auth.user?.access_token) {
			try {
				initOneSignal({ playerId: oneSignalId });
			} catch (er) {
				console.log(er);
			}
		}
	}, [oneSignalId, auth.user?.access_token]);

	return <>{props.children}</>;
};

export default OneSignalBounder;
