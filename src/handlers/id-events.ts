import { Callback, Context, EventBridgeEvent } from 'aws-lambda';
import _ from 'lodash';
import { Config } from '../config';
import {
    CustomError,
    events,
    UserCreatedEventDataType,
    UserDeletedEventDataType,
} from '@jmsoffredi/ms-common';
import { userDeletedEventHandler } from '../events/user-deleted-event';
import { userCreatedEventHandler } from '../events/user-created-event';

export const handler = async (
    event: EventBridgeEvent<
        string,
        UserDeletedEventDataType | UserCreatedEventDataType
    >,
    _context: Context,
    callback: Callback,
): Promise<void> => {
    console.log('Received event:', event);

    const eventType = _.get(event, Config.events.inputEvents.eventTypeLocation);
    let error: string | null = null;

    if (!process.env.USER_POOL_ID) {
        error = 'Environment variable USER_POOL_ID not found';
    }

    if (!process.env.AWS_REGION) {
        error = 'Environment variable AWS_REGION not found';
    }

    if (!error) {
        try {
            if (eventType === events.UserCreated.type) {
                error = await userCreatedEventHandler(
                    event as EventBridgeEvent<string, UserCreatedEventDataType>,
                );
            } else if (eventType === events.UserDeleted.type) {
                error = await userDeletedEventHandler(
                    event as EventBridgeEvent<string, UserDeletedEventDataType>,
                );
            } else {
                error = `Event type ${event['detail-type']} with detail type ${event.detail.type} not processed`;
            }
        } catch (err) {
            console.error(err);

            if (err instanceof CustomError) {
                error = JSON.stringify(err.serializeErrors());
            }
        }
    }

    if (callback) {
        callback(error, event);
    }
};
