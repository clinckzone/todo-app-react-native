import { useState, useEffect } from 'react';
import LoginScreen from './components/LoginScreen';
import TodoListScreen from './components/TodoListScreen';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { checkRefreshToken, renewAccessToken } from './utils/tokens';

const Stack = createStackNavigator();

export default function App() {
	const [isAuthenticated, setIsAuthenticated] = useState(null);

	useEffect(() => {
		const isRefereshTokenPresent = checkRefreshToken();
		if (isRefereshTokenPresent) {
			setIsAuthenticated(true);
			renewAccessToken();
		} else {
			setIsAuthenticated(false);
		}
	}, []);

	return (
		<NavigationContainer>
			{isAuthenticated === null ? // TODO: Add a loading screen if time permits
			null : (
				<Stack.Navigator initialRouteName={isAuthenticated ? 'Todos' : 'Login'}>
					<Stack.Screen name='Login' component={LoginScreen} />
					<Stack.Screen name='Todos' component={TodoListScreen} />
				</Stack.Navigator>
			)}
		</NavigationContainer>
	);
}
