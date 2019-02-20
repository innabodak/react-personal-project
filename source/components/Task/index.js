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
        _updateTask: func.isRequired,
        completed:   bool.isRequired,
        favorite:    bool.isRequired,
        id:          string.isRequired,
        message:     string.isRequired,
    };

    state = {
        isEditing: false,
        message:   this.props.message,
    };

    taskInp = createRef();

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

    _markFavorite = () => {
        const { _updateTask, favorite } = this.props;

        _updateTask(
            this._getTaskShape({
                favorite: !favorite,
            })
        );
    };

    _completeTask = () => {
        const { _updateTask, completed } = this.props;

        _updateTask(
            this._getTaskShape({
                completed: !completed,
            })
        );
    };

    _removeTaskAsync = () => {
        const { id, _removeTaskAsync } = this.props;

        return _removeTaskAsync(id);
    };

    _editTask = () => {
        const { isEditing } = this.state;

        this.taskInp.current.disabled = isEditing;
        this.taskInp.current.focus();
        this.setState({
            isEditing: !isEditing,
        });
    };

    _updateEditedMessage = (event) => {
        this.setState({
            message: event.target.value,
        });
    };

    _saveEditedMessage = (event) => {
        const editedMessage = this.state.message;
        const { _updateTask, message } = this.props;
        const enterKey = event.key === 'Enter';
        const escKey = event.key === 'Escape';

        switch (true) {
            case !editedMessage:
                break;
            case enterKey:
                _updateTask(
                    this._getTaskShape({
                        message: editedMessage,
                    })
                );
                this.setState({
                    isEditing: false,
                });
                break;
            case escKey:
                event.target.value = message;
                this.setState({
                    message,
                    isEditing: false,
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
        const { isEditing, message } = this.state;
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
                        onClick = { this._completeTask }
                    />
                    <input
                        disabled = { !isEditing }
                        maxLength = { 50 }
                        ref = { this.taskInp }
                        type = 'text'
                        value = { message }
                        onChange = { this._updateEditedMessage }
                        onKeyDown = { this._saveEditedMessage }
                    />
                </div>
                <div className = { Styles.actions }>
                    <Star
                        inlineBlock
                        checked = { task.favorite }
                        className = { Styles.toggleTaskFavoriteState }
                        color1 = { actionsFill }
                        color2 = { actionsStroke }
                        onClick = { this._markFavorite }
                    />
                    <Edit
                        inlineBlock
                        checked = { isEditing }
                        className = { Styles.updateTaskMessageOnClick }
                        color1 = { actionsFill }
                        color2 = { actionsStroke }
                        onClick = { this._editTask }
                    />
                    <Remove
                        inlineBlock
                        color1 = { actionsFill }
                        color2 = { actionsStroke }
                        onClick = { this._removeTaskAsync }
                    />
                </div>
            </li>
        );
    }
}
