import { storeUser } from '../utils/users';
import { storeTokens } from '../utils/tokens';
import { useState, useCallback } from 'react';
import { AntDesign } from '@expo/vector-icons';
import { SafeAreaView, View, StyleSheet } from 'react-native';
import {
	Text,
	Card,
	Button,
	TextInput,
	MD3Colors,
	ActivityIndicator,
} from 'react-native-paper';
import { useFocusEffect } from '@react-navigation/native';

const LoginScreen = ({ navigation }) => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState(false);
	const [loading, setLoading] = useState(false);

	useFocusEffect(
		useCallback(() => {
			setEmail('');
			setPassword('');
			setLoading(false);
			setError(false);
		}, [])
	);

	const fetchUser = useCallback(
		async (e) => {
			setLoading(true);
			const url = 'https://api.escuelajs.co/api/v1/auth/login';
			const payload = JSON.stringify({
				email,
				password,
			});

			try {
				const response = await fetch(url, {
					method: 'POST',
					body: payload,
					headers: {
						'Content-Type': 'application/json',
					},
				});

				const { access_token, refresh_token } = await response.json();

				if (access_token) {
					storeTokens(access_token, refresh_token);
					storeUser(email);
					navigation.navigate('Todos');
				} else {
					setError(true);
					setLoading(false);
				}
			} catch (error) {
				console.error('Error fetching data:', error);
			}
		},
		[email, password, storeTokens, navigation]
	);

	return (
		<SafeAreaView style={styles.container}>
			<View style={styles.headingContainer}>
				<AntDesign name='checksquare' size={30} color='black' />
				<Text variant='displaySmall' style={styles.heading}>
					Todoist
				</Text>
			</View>
			<Card mode='contained'>
				<Card.Content style={styles.cardContainer}>
					<TextInput
						style={styles.textInput}
						placeholder='Email'
						value={email}
						onChangeText={(newText) => {
							setEmail(newText);
							setError(false);
						}}
					/>
					<TextInput
						style={styles.textInput}
						placeholder='Password'
						value={password}
						onChangeText={(newText) => {
							setPassword(newText);
							setError(false);
						}}
						secureTextEntry={true}
					/>
					{loading ? (
						<ActivityIndicator
							size='large'
							animating={true}
							color={MD3Colors.primary40}
						/>
					) : (
						<Button
							mode='contained'
							style={styles.loginButton}
							onPress={fetchUser}
						>
							Log In
						</Button>
					)}
					{error ? (
						<Text variant='labelMedium' style={styles.errorText}>
							*Either email or password is incorrect
						</Text>
					) : null}
				</Card.Content>
			</Card>
		</SafeAreaView>
	);
};

export default LoginScreen;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		padding: 8,
	},
	headingContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		marginBottom: 20,
	},
	heading: { fontWeight: 600, textAlign: 'center', marginLeft: 10 },
	cardContainer: {
		backgroundColor: 'white',
		borderRadius: 6,
		alignItems: 'center',
		padding: 20,
	},
	textInput: {
		width: '90%',
		marginBottom: 20,
	},
	loginButton: {
		borderRadius: 4,
	},
	errorText: { marginTop: 10, color: 'red' },
});
