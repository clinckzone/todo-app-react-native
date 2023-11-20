import AsyncStorage from '@react-native-async-storage/async-storage';

export const storeUser = async (email) => {
	try {
		await AsyncStorage.setItem('email', email);
	} catch (error) {
		console.error('Failed to save email: ', error);
	}
};

export const getUsersList = async () => {
	try {
		const url = 'https://api.escuelajs.co/api/v1/users';
		const response = await fetch(url);
		const data = await response.json();
		return data;
	} catch (error) {
		console.error('Error while fetching user list:', error);
	}
};

export const getUserProfileData = async () => {
	try {
		const usersList = await getUsersList();
		const email = await AsyncStorage.getItem('email');
		const user = usersList.find((user) => user.email === email);
		return user;
	} catch (error) {
		console.error('Error while fetching user profile:', error);
	}
};

export const logoutUser = async () => {
	try {
		await AsyncStorage.multiRemove(['accessToken', 'refreshToken', 'email']);
		console.log('Tokens and email cleared!');
	} catch (e) {
		console.error('Failed to clear tokens and email:', e);
	}
};
