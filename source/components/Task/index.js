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
        created:          string.isRequired,
        favorite:         bool.isRequired,
        id:               string.isRequired,
        message:          string.isRequired,
        modified:         string,
    };

    state = {
        isTaskEditing:  false,
        newTaskMessage: this.props.message,
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

    _setTaskEditingState = () => {
        const { isTaskEditing } = this.state;

        this.taskInput.current.disabled = isTaskEditing;
        if (!isTaskEditing) {
            this.taskInput.current.focus();
        }
        this.setState({
            isTaskEditing: !isTaskEditing,
        });
    };

    _updateNewTaskMessage = (event) => {
        this.setState({
            newTaskMessage: event.target.value,
        });
    };

    _updateTaskMessageOnKeyDown = (event) => {
        const { newTaskMessage } = this.state;
        const { _updateTaskAsync, message } = this.props;
        const enterKey = event.key === 'Enter';
        const escKey = event.key === 'Escape';

        switch (true) {
            case !newTaskMessage:
                break;
            case enterKey:
                _updateTaskAsync(
                    this._getTaskShape({
                        newTaskMessage,
                    })
                );
                this.setState({
                    isTaskEditing: false,
                });
                break;
            case escKey:
                event.target.value = message;
                this.setState({
                    newTaskMessage: message,
                    isTaskEditing:  false,
                });
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
        const { isTaskEditing, newTaskMessage } = this.state;
        // console.log(this.props);
        const actionsStroke = '#000';
        const actionsFill = '#3B8EF3';

        return (
            <li className = { setTaskStyles }>
                <div className = { Styles.content }>
                    <Checkbox
                        inlineBlock
                        checked = { task.completed }
                        color1 = '#3B8EF3'
                        color2 = '#fff'
                        onClick = { this._toggleTaskCompletedState }
                    />
                    <input
                        disabled = { !isTaskEditing }
                        maxLength = { 50 }
                        ref = { this.taskInput }
                        type = 'text'
                        value = { newTaskMessage }
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
                        onClick = { this._setTaskEditingState }
                    />
                    <Remove
                        inlineBlock
                        color1 = { actionsFill }
                        color2 = { actionsStroke }
                        onClick = { this._removeTask }
                    />
                </div>
            </li>
        );
    }
}
