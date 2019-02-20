//Core
import React, { Component } from 'react';
import { object } from 'prop-types';

//Instruments
import Styles from './styles.m.css';

export default class Catcher extends Component {
    static propTypes = {
        children: object.isRequired,
    };

    state = {
        error: false,
    };

    componentDidCatch (error, stack) {
        console.log('ERROR:', error);
        console.log('STACKTRACE:', stack.componentStack);

        this.setState({
            error: true,
        });
    }

    render () {
        if (this.state.error) {
            return (
                <section className = { Styles.catcher }>
                    <h1>Some error occured.</h1>
                    <p>We are fixing it already! Please, try later</p>
                </section>
            );
        }

        return this.props.children;
    }
}
