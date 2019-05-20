import React from 'react';
import { Text } from 'react-native';
import PropTypes from 'prop-types';
import moment from 'moment';

export default class FlareDate extends React.PureComponent {
    render() {
        const { timestamp } = this.props;
        let display = '';
        if (!timestamp) {
            display = '?';
        } else {
            const actualDate = moment(timestamp);
            if (this.props.elapsed) {
                display = actualDate.fromNow();
            } else {
                const diff = moment()
                    .utc()
                    .diff(actualDate, 'hours');
                display =
                    diff > 6
                        ? actualDate.format('l LTS')
                        : actualDate.utc().fromNow();
            }
        }
        return <Text style={this.props.style}>{display}</Text>;
    }
}

FlareDate.propTypes = {
    timestamp: PropTypes.string.isRequired,
};
