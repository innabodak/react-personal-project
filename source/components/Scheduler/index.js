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
import { sortTasksByGroup, BaseTaskModel } from '../../instruments/helpers';

export default class Scheduler extends Component {
    state = {
        tasks:           [],
        newTaskMessage:  '',
        tasksFilter:     '',
        isTasksFetching: false,
    };

    componentDidMount () {
        this._fetchTasks();
    }

    _setTaskFetchingState = (state) => {
        this.setState({
            isTasksFetching: state,
        });
    };

    _updateNewTaskMessage = (event) => {
        this.setState({
            newTaskMessage: event.target.value,
        });
    };

    _handleFormSubmit = () => {
        event.preventDefault();
        this._createTaskAsync();
    };

    _submitOnEnter = () => {
        const enterKey = event.key === 'Enter';

        if (enterKey) {
            event.preventDefault();
            this._createTaskAsync();
        }
    };

    _fetchTasks = async () => {
        this._setTaskFetchingState(true);
        const tasks = await api.fetchTasks();

        this.setState({
            tasks,
            isTasksFetching: false,
        });
    };

    _createTaskAsync = async () => {
        const { newTaskMessage } = this.state;

        if (!newTaskMessage) {
            return null;
        }
        this._setTaskFetchingState(true);

        // const newTask = { ...new BaseTaskModel(), message: newTaskMessage };
        const newTask = await api.createTask(newTaskMessage);

        this.setState(({ tasks }) => ({
            tasks:           [newTask, ...tasks],
            newTaskMessage:  '',
            isTasksFetching: false,
        }));
    };

    _removeTaskAsync = async (id) => {
        this._setTaskFetchingState(true);
        await api.removeTask(id);
        this.setState(({ tasks }) => ({
            tasks:           tasks.filter((task) => task.id !== id),
            isTasksFetching: false,
        }));
    };

    _updateTask = async (taskToUpdate) => {
        this._setTaskFetchingState(true);

        const updatedTask = await api.updateTask(taskToUpdate);

        this.setState(({ tasks }) => ({
            tasks: tasks.map((task) =>
                task.id === updatedTask.id ? updatedTask : task
            ),
            isTasksFetching: false,
        }));
    };

    _completeAll = async () => {
        const { tasks } = this.state;
        const tasksToComplete = tasks.filter((task) => {
            return task.completed === false ? task.completed = true : null;
        });

        if (tasksToComplete.length !== 0) {
            this._setTaskFetchingState(true);

            await api.completeAllTasks(tasksToComplete);

            this.setState({
                tasks: tasks.map((task) => {
                    task.completed = true;

                    return task;
                }),
                isTasksFetching: false,
            });
        }
    };

    _isAllCompleted = () => {
        return this.state.tasks.every((task) => task.completed);
    };

    _onSearch = (event) => {
        this.setState({
            tasksFilter: event.target.value,
        });
    };

    _search = (tasks, tasksFilter) => {
        if (tasksFilter === '') {
            return tasks;
        }

        return tasks.filter((task) => {
            return (
                task.message.toLowerCase().indexOf(tasksFilter.toLowerCase()) >
                -1
            );
        });
    };

    render () {
        const {
            tasks,
            newTaskMessage,
            tasksFilter,
            isTasksFetching,
        } = this.state;
        const isAllCompleted = tasks.length ? this._isAllCompleted() : false;

        const tasksToShow = sortTasksByGroup(this._search(tasks, tasksFilter));

        //console.log(this.state);
        const taskJSX = tasksToShow.map((task) => {
            return (
                <Catcher key = { task.id }>
                    <Task
                        _removeTaskAsync = { this._removeTaskAsync }
                        _updateTask = { this._updateTask }
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
                            onChange = { this._onSearch }
                        />
                    </header>
                    <section>
                        <form onSubmit = { this._handleFormSubmit }>
                            <input
                                maxLength = { 50 }
                                placeholder = 'Описaние моей новой задачи'
                                type = 'text'
                                value = { newTaskMessage }
                                onChange = { this._updateNewTaskMessage }
                                onKeyPress = { this._submitOnEnter }
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
                            color2 = '#fff'
                            onClick = { this._completeAll }
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
