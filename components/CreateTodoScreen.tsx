import uuid from 'react-native-uuid';
import { TodoStatus } from '../utils/todos';
import { useCallback, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';
import {
	Button,
	PaperProvider,
	Text,
	TextInput,
	IconButton,
	MD3Colors,
} from 'react-native-paper';

const CreateTodoScreen = ({ navigation }) => {
	const [title, setTitle] = useState('');
	const [description, setDescription] = useState('');
	const [subtasks, setSubtasks] = useState([]);

	const addSubtask = () => {
		setSubtasks([...subtasks, {}]);
	};

	const updateSubtask = (index, value) => {
		const newSubtasks = [...subtasks];
		newSubtasks[index] = { value: value, completed: false };
		setSubtasks(newSubtasks);
	};

	const deleteSubtask = (index) => {
		const newSubtasks = [...subtasks];
		newSubtasks.splice(index, 1);
		setSubtasks(newSubtasks);
	};

	const createTodo = useCallback(async () => {
		try {
			const email = await AsyncStorage.getItem('email');
			if (!email) {
				console.error('Email not found');
				return;
			}

			const todo = {
				id: uuid.v4(),
				email,
				title,
				description,
				subtasks,
				status: TodoStatus.TODO,
			};

			let todos = await AsyncStorage.getItem('todos');
			todos = todos ? JSON.parse(todos) : [];
			if (!Array.isArray(todos)) {
				console.error('Stored todos are not in the expected format');
				return;
			}
			todos.push(todo);
			await AsyncStorage.setItem('todos', JSON.stringify(todos));
			navigation.goBack();
		} catch (error) {
			console.error('Error creating new todo', error);
		}
	}, [title, description, subtasks]);

	return (
		<PaperProvider>
			<SafeAreaView style={styles.container}>
				<ScrollView>
					<Text variant='titleMedium'>Title</Text>
					<TextInput
						placeholder='e.g. Take coffee break'
						mode='outlined'
						style={styles.textField}
						onChangeText={(newText) => setTitle(newText)}
					></TextInput>
					<Text variant='titleMedium'>Description</Text>
					<TextInput
						placeholder="e.g. It's good to take a break. The 15 min break with recharge your batteries a little"
						mode='outlined'
						multiline={true}
						numberOfLines={4}
						style={styles.textArea}
						onChangeText={(newText) => setDescription(newText)}
					/>
					<Text variant='titleMedium'>Subtasks</Text>
					{subtasks.map((task, index) => (
						<View key={index} style={styles.subtaskContainer}>
							<TextInput
								mode='outlined'
								value={task.value}
								placeholder='Describe subtask'
								onChangeText={(value) => updateSubtask(index, value)}
								style={styles.subTextField}
							/>
							<IconButton icon='close' onPress={() => deleteSubtask(index)} />
						</View>
					))}
					<Button
						mode='outlined'
						onPress={addSubtask}
						style={styles.addSubtaskButton}
					>
						+ Add New Subtask
					</Button>
				</ScrollView>
				<Button
					mode='contained'
					style={styles.createTodoButton}
					onPress={() => createTodo()}
				>
					Create Todo
				</Button>
			</SafeAreaView>
		</PaperProvider>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 20,
	},
	textField: {
		marginBottom: 10,
	},
	textArea: {
		marginBottom: 10,
		paddingTop: 10,
	},
	subTextField: { flex: 1, marginRight: 10 },
	subtaskContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: 10,
	},
	addSubtaskButton: {
		marginTop: 10,
		marginBottom: 20,
		borderColor: MD3Colors.primary60,
	},
	createTodoButton: { marginTop: 20 },
});

export default CreateTodoScreen;
