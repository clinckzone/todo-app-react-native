import AsyncStorage from '@react-native-async-storage/async-storage';

export const storeTokens = async (accessToken, refreshToken) => {
	try {
		await AsyncStorage.multiSet([
			['accessToken', accessToken],
			['refreshToken', refreshToken],
		]);
	} catch (error) {
		console.error('Failed to save tokens: ', error);
	}
};

export const renewAccessToken = async () => {
	try {
		const refreshToken = await AsyncStorage.getItem('refreshToken');
		if (refreshToken !== null) {
			const url = 'https://api.escuelajs.co/api/v1/auth/refresh-token';
			const payload = JSON.stringify({ refreshToken });
			const response = await fetch(url, {
				method: 'POST',
				body: payload,
				headers: { 'Content-Type': 'application/json' },
			});

			const { access_token, refresh_token } = await response.json();

			if (access_token) {
				storeTokens(access_token, refresh_token);
				return true;
			}
		}
	} catch (error) {
		console.error('Error while fetching refresh token:', error);
	}
	return false;
};
