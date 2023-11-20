import { TodoStatus } from '../utils/todos';
import { useCallback, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TextStyle,
  View,
} from 'react-native';
import { Button, Card, Checkbox, IconButton, Text } from 'react-native-paper';

const TodoListScreen = ({ navigation }) => {
  const [todos, setTodos] = useState(null);

  const toggleTaskStatus = useCallback(
    (todoIndex, taskIndex, status) => {
      const newTodos = [...todos];
      const todo = newTodos[todoIndex];
      const subtasks = todo.subtasks;

      subtasks[taskIndex].completed = !status;
      todo.status = getTodoStatus(subtasks);

      setTodos(newTodos);
      saveTodos(newTodos);
    },
    [todos]
  );

  const deleteTodos = useCallback(
    (todoIndex) => {
      const newTodos = [...todos];
      newTodos.splice(todoIndex, 1);
      setTodos(newTodos);
      saveTodos(newTodos);
    },
    [todos]
  );

  const getTodoStatus = useCallback((subtasks) => {
    let status = TodoStatus.TODO;
    const isInProgress = subtasks.some((task) => {
      if (task.completed) return true;
      else return false;
    });

    const isCompleted = subtasks.every((task) => {
      if (task.completed) return true;
      else return false;
    });

    if (isInProgress) status = TodoStatus.IN_PROGRESS;
    if (isCompleted) status = TodoStatus.COMPLETED;

    return status;
  }, []);

  const saveTodos = async (todos) => {
    try {
      await AsyncStorage.setItem('todos', JSON.stringify(todos));
    } catch (error) {
      console.error('Error while saving todos data');
    }
  };

  useFocusEffect(
    useCallback(() => {
      (async () => {
        try {
          const email = await AsyncStorage.getItem('email');
          if (!email) {
            console.error('Email not found');
            return;
          }

          let todos = await AsyncStorage.getItem('todos');
          console.log(todos);
          todos = todos ? JSON.parse(todos) : [];

          if (!Array.isArray(todos)) {
            console.error('Stored todos are not in the expected format');
            return;
          }

          const filteredTodos = todos.filter((todo) => todo.email === email);
          setTodos(filteredTodos);
        } catch (error) {
          console.error('Error fetching todos', error);
        }
      })();
    }, [])
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {todos !== null &&
          todos.map((todo, todoIndex) => {
            return (
              <Card key={todo.id} mode='contained' style={styles.todoCard}>
                <Text
                  variant='titleLarge'
                  style={styleFunctions.getTodoStatusStyle(todo.status)}
                >
                  {todo.title}
                </Text>
                <Text
                  variant='bodyLarge'
                  style={styleFunctions.getTodoStatusStyle(todo.status)}
                >
                  {todo.description}
                </Text>
                {todo.subtasks.map((task, taskIndex) => {
                  return (
                    <View key={taskIndex} style={styles.task}>
                      <Checkbox
                        status={task.completed ? 'checked' : 'unchecked'}
                        onPress={() =>
                          toggleTaskStatus(todoIndex, taskIndex, task.completed)
                        }
                      />
                      <Text
                        key={taskIndex}
                        style={styleFunctions.getCompletedTaskStyle(
                          task.completed
                        )}
                      >
                        {task.value}
                      </Text>
                    </View>
                  );
                })}
                <View style={styles.cardLabel}>
                  <View style={{ flexDirection: 'row' }}>
                    <Text style={{ marginRight: 5 }}>Status:</Text>
                    <Text
                      style={styleFunctions.getStatusLabelStyle(todo.status)}
                      variant='labelLarge'
                    >
                      {`${todo.status}`.toUpperCase()}
                    </Text>
                  </View>
                  <IconButton
                    icon='delete'
                    style={styles.deleteButton}
                    onPress={() => deleteTodos(todoIndex)}
                  />
                </View>
              </Card>
            );
          })}
        <Button
          icon='plus'
          mode='contained'
          style={styles.addTodoButton}
          onPress={() => {
            navigation.navigate('Create Todo');
          }}
        >
          Add todo
        </Button>
      </ScrollView>
    </SafeAreaView>
  );
};

export default TodoListScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  todoCard: {
    padding: 20,
    paddingBottom: 10,
    marginTop: 20,
    backgroundColor: 'white',
  },
  cardLabel: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  deleteButton: {
    margin: 0,
  },
  addTodoButton: {
    marginTop: 20,
  },
  task: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

const styleFunctions = {
  getTodoStatusStyle: (status: TodoStatus): TextStyle => {
    if (status === TodoStatus.COMPLETED)
      return { textDecorationLine: 'line-through', opacity: 0.5 };
    return {};
  },
  getStatusLabelStyle: (status: TodoStatus): TextStyle => {
    switch (status) {
      case TodoStatus.TODO:
        return { color: 'red' };

      case TodoStatus.IN_PROGRESS:
        return { color: 'orange' };

      case TodoStatus.COMPLETED:
        return { color: 'green' };
    }
  },
  getCompletedTaskStyle: (completed: boolean): TextStyle => {
    if (completed) return { textDecorationLine: 'line-through', opacity: 0.5 };
    return {};
  },
};
