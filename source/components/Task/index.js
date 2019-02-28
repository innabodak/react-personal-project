// Core
import React, { PureComponent, createRef } from 'react';
import { func, bool, string } from 'prop-types';
import cx from 'classnames';

//Components
import Checkbox from '../../theme/assets/Checkbox';
import Star from '../../theme/assets/Star';
import Edit from '../../theme/assets/Edit';
import Remove from '../../theme/assets/Remove';

// Instruments
import Styles from './styles.m.css';

export default class Task extends PureComponent {
    static propTypes = {
        _removeTaskAsync: func.isRequired,
        _updateTaskAsync: func.isRequired,
        completed:        bool.isRequired,
        favorite:         bool.isRequired,
        id:               string.isRequired,
        message:          string.isRequired,
        created:          string,
        modified:         string,
    };

    state = {
        isTaskEditing: false,
        newMessage:    this.props.message,
    };

    taskInput = createRef();

    _getTaskShape = ({
        id = this.props.id,
        completed = this.props.completed,
        favorite = this.props.favorite,
        message = this.props.message,
    }) => ({
        id,
        completed,
        favorite,
        message,
    });

    _toggleTaskFavoriteState = () => {
        const { _updateTaskAsync, favorite } = this.props;

        _updateTaskAsync(
            this._getTaskShape({
                favorite: !favorite,
            })
        );
    };

    _toggleTaskCompletedState = () => {
        const { _updateTaskAsync, completed } = this.props;

        _updateTaskAsync(
            this._getTaskShape({
                completed: !completed,
            })
        );
    };

    _removeTask = () => {
        const { id, _removeTaskAsync } = this.props;

        return _removeTaskAsync(id);
    };

    _setTaskEditingState = (isTaskEditing) => {
        this.taskInput.current.disabled = !isTaskEditing;

        if (isTaskEditing) {
            this.taskInput.current.focus();
        }
        this.setState({
            isTaskEditing,
        });
    };

    _updateNewTaskMessage = (event) => {
        this.setState({
            newMessage: event.target.value,
        });
    };

    _updateTask = () => {
        const { _updateTaskAsync, message } = this.props;
        const { newMessage } = this.state;

        if (message !== newMessage) {
            _updateTaskAsync(
                this._getTaskShape({
                    message: newMessage,
                })
            );
        }
        this._setTaskEditingState(false);

        return null;
    };

    _updateTaskMessageOnClick = () => {
        const { isTaskEditing } = this.state;

        if (isTaskEditing) {
            this._updateTask();

            return null;
        }

        this._setTaskEditingState(true);
    };

    _cancelUpdatingTaskMessage = () => {
        const { message } = this.props;

        this.setState({
            newMessage: message,
        });

        this._setTaskEditingState(false);
    };

    _updateTaskMessageOnKeyDown = (event) => {
        const { newMessage } = this.state;
        const enterKey = event.key === 'Enter';
        const escKey = event.key === 'Escape';

        switch (true) {
            case !newMessage:
                return null;
                break;
            case newMessage && enterKey:
                this._updateTask();
                break;
            case newMessage && escKey:
                this._cancelUpdatingTaskMessage();
                break;
            default:
                break;
        }
    };

    _setTaskStyles = () => {
        const { completed } = this.props;

        return cx(Styles.task, {
            [Styles.completed]: completed,
        });
    };

    render () {
        const task = this._getTaskShape({ ...this.props });
        const setTaskStyles = this._setTaskStyles();
        const { isTaskEditing, newMessage } = this.state;
        const actionsStroke = '#000';
        const actionsFill = '#3B8EF3';

        return (
            <li className = { setTaskStyles }>
                <div className = { Styles.content }>
                    <Checkbox
                        inlineBlock
                        checked = { task.completed }
                        className = { Styles.toggleTaskCompletedState }
                        color1 = { actionsFill }
                        color2 = '#FFF'
                        onClick = { this._toggleTaskCompletedState }
                    />
                    <input
                        disabled = { !isTaskEditing }
                        maxLength = { 50 }
                        ref = { this.taskInput }
                        type = 'text'
                        value = { newMessage }
                        onChange = { this._updateNewTaskMessage }
                        onKeyDown = { this._updateTaskMessageOnKeyDown }
                    />
                </div>
                <div className = { Styles.actions }>
                    <Star
                        inlineBlock
                        checked = { task.favorite }
                        className = { Styles.toggleTaskFavoriteState }
                        color1 = { actionsFill }
                        color2 = { actionsStroke }
                        onClick = { this._toggleTaskFavoriteState }
                    />
                    <Edit
                        inlineBlock
                        checked = { isTaskEditing }
                        className = { Styles.updateTaskMessageOnClick }
                        color1 = { actionsFill }
                        color2 = { actionsStroke }
                        onClick = { this._updateTaskMessageOnClick }
                    />
                    <Remove
                        inlineBlock
                        className = 'removeTask'
                        color1 = { actionsFill }
                        color2 = { actionsStroke }
                        onClick = { this._removeTask }
                    />
                </div>
            </li>
        );
    }
}
