import AWS from 'aws-sdk';
import { UserDeletedEventDataType } from '@jmsoffredi/ms-common';
import { EventBridgeEvent } from 'aws-lambda';
import _ from 'lodash';
import { Config } from '../config';

export const userDeletedEventHandler = (
    event: EventBridgeEvent<string, UserDeletedEventDataType>,
): string | null => {
    let error: string | null = null;

    const userId = _.get(
        event,
        Config.events.inputEvents.events.userDeleted.userIdLocation,
    );

    if (userId) {
        const userEmail = _.get(
            event,
            Config.events.inputEvents.events.userCreated.userEmailLocation,
        );

        if (userEmail) {
            const cognitoidentityserviceprovider =
                new AWS.CognitoIdentityServiceProvider();

            cognitoidentityserviceprovider.adminDeleteUser(
                {
                    UserPoolId: process.env.USER_POOL_ID as string,
                    Username: userEmail,
                },
                (err, data) => {
                    if (err) {
                        console.error(err);
                        error = err.message;
                    } else {
                        console.log(data);
                    }
                },
            );
        } else {
            error = 'User email missing in event detail.data';
        }
    } else {
        error = 'User id missing in event detail.data';
    }

    return error;
};
