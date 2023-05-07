import { UserCreatedEventDataType } from '@jmsoffredi/ms-common';
import { EventBridgeEvent } from 'aws-lambda';
import _ from 'lodash';
import { Config } from '../config';
import {
    AdminCreateUserCommand,
    AdminCreateUserCommandInput,
    CognitoIdentityProviderClient,
} from '@aws-sdk/client-cognito-identity-provider';

export const userCreatedEventHandler = async (
    event: EventBridgeEvent<string, UserCreatedEventDataType>,
): Promise<string | null> => {
    let error: string | null = null;

    const userId = _.get(
        event,
        Config.events.inputEvents.events.userCreated.userIdLocation,
    );

    if (userId) {
        const userEmail = _.get(
            event,
            Config.events.inputEvents.events.userCreated.userEmailLocation,
        );

        if (userEmail) {
            const newUserParams: AdminCreateUserCommandInput = {
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

            const cognitoClient = new CognitoIdentityProviderClient({
                region: process.env.AWS_REGION,
            });
            const command = new AdminCreateUserCommand(newUserParams);

            try {
                const response = await cognitoClient.send(command);
                console.log(response);
            } catch (err: unknown) {
                console.error(err);

                if (err instanceof Error) {
                    error = err.message;
                } else {
                    error = 'Unknown error deleting Cognito user';
                }
            }
        } else {
            error = 'User email missing in event detail.data';
        }
    } else {
        error = 'User id missing in event detail.data';
    }

    return error;
};
