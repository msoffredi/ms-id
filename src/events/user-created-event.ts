import AWS from 'aws-sdk';
import {
    EventHandler,
    RequestValidationError,
    UserCreatedEventDataType,
} from '@jmsoffredi/ms-common';
import { EventBridgeEvent } from 'aws-lambda';
import _ from 'lodash';
import { Config } from '../config';

export const userCreatedEventHandler: EventHandler<
    string,
    UserCreatedEventDataType
> = async (
    event: EventBridgeEvent<string, UserCreatedEventDataType>,
): Promise<string | null> => {
    const userId = _.get(
        event,
        Config.events.inputEvents.events.userCreated.userIdLocation,
    );

    if (!userId) {
        throw new RequestValidationError([
            {
                message: 'user id missing in event detail.data',
                field: 'id',
            },
        ]);
    }

    const userEmail = _.get(
        event,
        Config.events.inputEvents.events.userCreated.userEmailLocation,
    );

    if (!userEmail) {
        throw new RequestValidationError([
            {
                message: 'user email missing in event detail.data',
                field: 'email',
            },
        ]);
    }

    const newUserParams = {
        UserPoolId: process.env.USER_POOL_ID as string,
        Username: userEmail,
        DesiredDeliveryMediums: ['EMAIL'],
        UserAttributes: [
            {
                Name: 'email',
                Value: userEmail,
            },
            {
                Name: 'custom:userId',
                Value: userId,
            },
        ],
    };

    const cognitoidentityserviceprovider =
        new AWS.CognitoIdentityServiceProvider();

    cognitoidentityserviceprovider.adminCreateUser(
        newUserParams,
        (err, data) => {
            if (err) {
                console.error(err);
            } else {
                console.log(data);
            }
        },
    );

    // const user = await User.get(userId);

    // if (!user) {
    //     const userEmail = _.get(
    //         event,
    //         Config.events.inputEvents.events.userCreated.userEmailLocation,
    //     );

    //     let roles: string[] = [];
    //     if (userEmail === process.env.SUPER_ADMIN_EMAIL) {
    //         console.log(`New super user initialized`);
    //         roles = await initSuperAdminRole();
    //     }

    //     await User.create({
    //         id: userId,
    //         roles,
    //     });
    // } else {
    //     throw new DatabaseError(
    //         `Could not create user with id: ${userId}. User already exists!`,
    //     );
    // }

    return null;
};
