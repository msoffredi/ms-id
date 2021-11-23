import { Callback, Context, EventBridgeEvent } from 'aws-lambda';
import _ from 'lodash';
import { Config } from '../config';
import {
    CustomError,
    events,
    UserCreatedEventDataType,
    UserDeletedEventDataType,
} from '@jmsoffredi/ms-common';
// import { userDeletedEventHandler } from '../events/user-deleted-event';
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

    if (!process.env.USER_POOL_ID || process.env.USER_POOL_ID.trim() === '') {
        error = 'Environment variable USER_POOL_ID not found';
    }

    if (!error) {
        if (eventType === events.UserCreated.type) {
            try {
                error = await userCreatedEventHandler(
                    event as EventBridgeEvent<string, UserCreatedEventDataType>,
                );
            } catch (err) {
                console.error(err);

                if (err instanceof CustomError) {
                    error = JSON.stringify(err.serializeErrors());
                }
            }
        } else {
            error = `Event type ${event['detail-type']} with detail type ${event.detail.type} not processed`;
        }
    }

    if (callback) {
        callback(error, event);
    }
};
