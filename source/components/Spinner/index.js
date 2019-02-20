// Core
import React, { Component } from 'react';
import { createPortal } from 'react-dom';
import { bool } from 'prop-types';

// Instruments
import Styles from './styles.m.css';

const portal = document.getElementById('spinner');

export default class Spinner extends Component {
    static propTypes = {
        isSpinning: bool.isRequired,
    };

    render () {
        const { isSpinning } = this.props;

        return createPortal(
            isSpinning ? <div className = { Styles.spinner } /> : null,
            portal
        );
    }
}
