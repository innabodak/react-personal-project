// Core
import React, { Component } from 'react';
import FlipMove from 'react-flip-move';
// import { CSSTransition, TransitionGroup } from 'react-transition-group';
// import { fromTo } from 'gsap';

//Components
import Spinner from '../Spinner';
import Task from '../Task';
import Checkbox from '../../theme/assets/Checkbox';

// Instruments
import Styles from './styles.m.css';
import { api } from '../../REST'; // ! Импорт модуля API должен иметь именно такой вид (import { api } from '../../REST')
import { sortTasksByGroup, BaseTaskModel } from '../../instruments/helpers';

export default class Scheduler extends Component {
    state = {
        tasks:          [],
        newTaskMessage: '',
        taskToSearch:   '',
        isTaskFetching: false,
    };

    _setTaskFetchingState = (state) => {
        this.setState({
            isTaskFetching: state,
        });
    };

    _updateNewTaskMessage = (event) => {
        this.setState({
            newTaskMessage: event.target.value,
        });
    };

    _handleFormSubmit = () => {
        event.preventDefault();
        this._createTask();
    };

    _submitOnEnter = () => {
        const enterKey = event.key === 'Enter';

        if (enterKey) {
            event.preventDefault();
            this._createTask();
        }
    };

    _createTask = () => {
        const { newTaskMessage } = this.state;

        if (!newTaskMessage) {
            return null;
        }
        this._setTaskFetchingState(true);

        const newTask = { ...new BaseTaskModel(), message: newTaskMessage };

        this.setState(({ tasks }) => ({
            tasks:          [newTask, ...tasks],
            newTaskMessage: '',
            isTaskFetching: false,
        }));
    };

    _removeTask = (id) => {
        this._setTaskFetchingState(true);
        this.setState(({ tasks }) => ({
            tasks:          tasks.filter((task) => task.id !== id),
            isTaskFetching: false,
        }));
    };

    _updateTask = (taskToUpdate) => {
        this._setTaskFetchingState(true);

        this.setState(({ tasks }) => ({
            tasks: tasks.map((task) =>
                task.id === taskToUpdate.id ? taskToUpdate : task
            ),
            isTaskFetching: false,
        }));
    };

    _completeAll = () => {
        this._setTaskFetchingState(true);
        this.setState(({ tasks }) => ({
            tasks: tasks.map((task) => {
                task.completed = true;

                return task;
            }),
            isTaskFetching: false,
        }));
    };

    _isAllCompleted = () => {
        return this.state.tasks.every((task) => task.completed);
    };

    _onSearch = (event) => {
        this.setState({
            taskToSearch: event.target.value,
        });
    };

    _search = (tasks, taskToSearch) => {
        if (taskToSearch === '') {
            return tasks;
        }

        return tasks.filter((task) => {
            return (
                task.message.toLowerCase().indexOf(taskToSearch.toLowerCase()) >
                -1
            );
        });
    };

    render () {
        const {
            tasks,
            newTaskMessage,
            taskToSearch,
            isTaskFetching,
        } = this.state;
        const isAllCompleted = tasks.length ? this._isAllCompleted() : false;

        const tasksToShow = sortTasksByGroup(this._search(tasks, taskToSearch));

        //console.log(this.state);
        const taskJSX = tasksToShow.map((task) => {
            return (
                <Task
                    _removeTask = { this._removeTask }
                    _updateTask = { this._updateTask }
                    key = { task.id }
                    { ...task }
                />
            );
        });

        return (
            <section className = { Styles.scheduler }>
                <Spinner isSpinning = { isTaskFetching } />
                <main>
                    <header>
                        <h1>Планировщик задач</h1>
                        <input
                            placeholder = 'Поиск'
                            type = 'search'
                            value = { taskToSearch }
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
                            <ul>
                                <FlipMove duration = { 500 }>{taskJSX}</FlipMove>
                            </ul>
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
