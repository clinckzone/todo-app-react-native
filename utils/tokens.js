import AsyncStorage from '@react-native-async-storage/async-storage';

export const storeTokens = async (accessToken, refreshToken) => {
	try {
		await AsyncStorage.multiSet([
			['accessToken', accessToken],
			['refreshToken', refreshToken],
		]);
	} catch (e) {
		console.error('Failed to save the tokens: ', e);
	}
};

export const checkRefreshToken = async () => {
	try {
		const refreshToken = await AsyncStorage.getItem('refreshToken');
		if (refreshToken !== null) {
			return true;
		}
	} catch (e) {
		console.error('Failed to fetch the refresh token: ', e);
	}
	return false;
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

			const { access_token, refresh_token} =
				await response.json();

			if (access_token) storeTokens(access_token, refresh_token);
		}
	} catch (error) {
		console.error('Error fetching data:', error);
	}
};
