import { EventBusTypes, events } from '@jmsoffredi/ms-common';
import { ConfigType } from './types';

export const Config: ConfigType = {
    events: {
        eventBusType: EventBusTypes.AWSEventBridge,
        inputEvents: {
            eventTypeLocation: 'detail.type',
            eventDataLocation: 'detail.data',
            events: {
                userDeleted: {
                    eventType: events.UserDeleted.type,
                    userIdLocation: 'detail.data.id',
                    userEmailLocation: 'detail.data.email',
                },
                userCreated: {
                    eventType: events.UserCreated.type,
                    userIdLocation: 'detail.data.id',
                    userEmailLocation: 'detail.data.email',
                },
            },
        },
    },
};
