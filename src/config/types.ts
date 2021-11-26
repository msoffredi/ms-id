import { EventBusTypes } from '@jmsoffredi/ms-common';

export interface ConfigType {
    events: {
        eventBusType: EventBusTypes;
        inputEvents: {
            eventTypeLocation: string;
            eventDataLocation: string;
            events: {
                userDeleted: {
                    eventType: string;
                    userIdLocation: string;
                    userEmailLocation: string;
                };
                userCreated: {
                    eventType: string;
                    userIdLocation: string;
                    userEmailLocation: string;
                };
            };
        };
    };
}
