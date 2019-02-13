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
        _removeTask: func.isRequired,
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

    _removeTask = () => {
        const { id, _removeTask } = this.props;

        return _removeTask(id);
    };

    _editTask = () => {
        // console.log('jj');
        // const { _updateTask, message } = this.props;

        this.setState({
            isEditing: true,
        });

        this.taskInp.current.focus();

        // _updateTask(
        //     this._getTaskShape({
        //         message: newMessage,
        //     })
        // );
    };

    _updateEditedMessage = (event) => {
        //const { _updateTask, message } = this.props;

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
                //return null;
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
                this.setState({
                    message,
                    isEditing: false,
                });
                break;
            default:
                //return null;
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
        // const actionsTEST = 'red';

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
                        // disabled
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
                        // color3 = { actionsTEST }
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
                        onClick = { this._removeTask }
                    />
                </div>
            </li>
        );
    }
}
