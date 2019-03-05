// Core
import React, { Component } from 'react';
import FlipMove from 'react-flip-move';

//Components
import Spinner from '../Spinner';
import Task from '../Task';
import Checkbox from '../../theme/assets/Checkbox';
import Catcher from '../Catcher';

// Instruments
import Styles from './styles.m.css';
import { api } from '../../REST'; // ! Импорт модуля API должен иметь именно такой вид (import { api } from '../../REST')
import { sortTasksByGroup } from '../../instruments/helpers';

export default class Scheduler extends Component {
    state = {
        tasks:           [],
        newTaskMessage:  '',
        tasksFilter:     '',
        isTasksFetching: false,
    };

    componentDidMount () {
        this._fetchTasksAsync();
    }

    _setTasksFetchingState = (state) => {
        this.setState({
            isTasksFetching: state,
        });
    };

    _updateNewTaskMessage = (event) => {
        this.setState({
            newTaskMessage: event.target.value,
        });
    };

    _fetchTasksAsync = async () => {
        this._setTasksFetchingState(true);
        const tasks = await api.fetchTasks();

        this.setState({
            tasks,
        });

        this._setTasksFetchingState(false);
    };

    _createTaskAsync = async (event) => {
        event.preventDefault();
        const { newTaskMessage } = this.state;

        if (!newTaskMessage) {
            return null;
        }
        this._setTasksFetchingState(true);

        const newTask = await api.createTask(newTaskMessage);

        this.setState(({ tasks }) => ({
            tasks:          [newTask, ...tasks],
            newTaskMessage: '',
        }));

        this._setTasksFetchingState(false);
    };

    _removeTaskAsync = async (id) => {
        this._setTasksFetchingState(true);
        await api.removeTask(id);
        this.setState(({ tasks }) => ({
            tasks: tasks.filter((task) => task.id !== id),
        }));

        this._setTasksFetchingState(false);
    };

    _updateTaskAsync = async (taskToUpdate) => {
        this._setTasksFetchingState(true);

        const updatedTask = await api.updateTask(taskToUpdate);

        this.setState(({ tasks }) => ({
            tasks: tasks.map((task) =>
                task.id === updatedTask.id ? updatedTask : task
            ),
        }));

        this._setTasksFetchingState(false);
    };

    _completeAllTasksAsync = async () => {
        const { tasks } = this.state;
        const tasksToComplete = tasks.filter((task) => {
            return task.completed === false ? task.completed = true : null;
        });

        if (tasksToComplete.length !== 0) {
            this._setTasksFetchingState(true);

            await api.completeAllTasks(tasksToComplete);

            this.setState({
                tasks: tasks.map((task) => {
                    task.completed = true;

                    return task;
                }),
            });

            this._setTasksFetchingState(false);
        } else {
            return null;
        }
    };

    _getAllCompleted = () => {
        return this.state.tasks.every((task) => task.completed);
    };

    _updateTasksFilter = (event) => {
        this.setState({
            tasksFilter: event.target.value.toLowerCase(),
        });
    };

    _search = () => {
        const { tasks, tasksFilter } = this.state;

        if (tasksFilter) {
            return tasks.filter((task) => {
                return (
                    task.message
                        .toLowerCase()
                        .indexOf(tasksFilter.toLowerCase()) > -1
                );
            });
        }

        return tasks;
    };

    render () {
        const {
            tasks,
            newTaskMessage,
            tasksFilter,
            isTasksFetching,
        } = this.state;
        const isAllCompleted = tasks.length ? this._getAllCompleted() : false;

        const tasksToShow = sortTasksByGroup(this._search());

        const taskJSX = tasksToShow.map((task) => {
            return (
                <Catcher key = { task.id }>
                    <Task
                        _removeTaskAsync = { this._removeTaskAsync }
                        _updateTaskAsync = { this._updateTaskAsync }
                        { ...task }
                    />
                </Catcher>
            );
        });

        return (
            <section className = { Styles.scheduler }>
                <Spinner isSpinning = { isTasksFetching } />
                <main>
                    <header>
                        <h1>Планировщик задач</h1>
                        <input
                            placeholder = 'Поиск'
                            type = 'search'
                            value = { tasksFilter }
                            onChange = { this._updateTasksFilter }
                        />
                    </header>
                    <section>
                        <form onSubmit = { this._createTaskAsync }>
                            <input
                                maxLength = { 50 }
                                placeholder = 'Описaние моей новой задачи'
                                type = 'text'
                                value = { newTaskMessage }
                                onChange = { this._updateNewTaskMessage }
                            />
                            <button type = 'submit'>Добавить задачу</button>
                        </form>
                        <div>
                            <FlipMove duration = { 500 } typeName = 'ul'>
                                {taskJSX}
                            </FlipMove>
                        </div>
                    </section>
                    <footer>
                        <Checkbox
                            inlineBlock
                            checked = { isAllCompleted }
                            color1 = '#363636'
                            color2 = '#FFF'
                            onClick = { this._completeAllTasksAsync }
                        />
                        <span className = { Styles.completeAllTasks }>
                            Все задачи выполнены
                        </span>
                    </footer>
                </main>
            </section>
        );
    }
}
