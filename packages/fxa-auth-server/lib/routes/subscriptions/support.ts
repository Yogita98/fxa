/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
import { ServerRoute } from '@hapi/hapi';
import isA from '@hapi/joi';
import zendesk from 'node-zendesk';
import pRetry from 'p-retry';

import { ConfigType } from '../../../config';
import error from '../../error';
import { AuthLogger, AuthRequest } from '../../types';
import { handleAuth } from './utils';

export const supportRoutes = (
  log: AuthLogger,
  db: any,
  config: ConfigType,
  customs: any,
  zendeskClient: zendesk.Client
): ServerRoute[] => {
  // Skip routes if the subscriptions feature is not configured & enabled
  if (!config.subscriptions || !config.subscriptions.enabled) {
    return [];
  }

  return [
    {
      method: 'POST',
      path: '/support/ticket',
      options: {
        auth: {
          payload: false,
          strategy: 'oauthToken',
        },
        validate: {
          payload: isA.object().keys({
            productName: isA.string().required(),
            topic: isA.string().required(),
            app: isA.string().allow('').optional(),
            subject: isA.string().allow('').optional(),
            message: isA.string().required(),
          }),
        },
        response: {
          schema: isA.object().keys({
            success: isA.bool().required(),
            ticket: isA.number().optional(),
            error: isA.string().optional(),
          }),
        },
      },
      handler: async function (request: AuthRequest) {
        log.begin('support.ticket', request);
        const { uid, email } = await handleAuth(db, request.auth, true);
        const { location } = request.app.geo;
        await customs.check(request, email, 'supportRequest');

        const {
          productName,
          topic,
          app,
          subject: payloadSubject,
          message,
        } = request.payload as Record<string, any>;
        let subject = productName;
        if (payloadSubject) {
          subject = subject.concat(': ', payloadSubject);
        }

        const {
          productNameFieldId,
          locationCityFieldId,
          locationStateFieldId,
          locationCountryFieldId,
          topicFieldId,
          appFieldId,
        } = config.zendesk;

        const zendeskReq: zendesk.Requests.CreatePayload = {
          request: {
            comment: { body: message },
            subject,
            requester: {
              email,
              name: email,
            },
            custom_fields: [
              { id: productNameFieldId, value: productName },
              { id: topicFieldId, value: topic },
              { id: appFieldId, value: app },
              { id: locationCityFieldId, value: location.city },
              { id: locationStateFieldId, value: location.state },
              { id: locationCountryFieldId, value: location.country },
            ],
          },
        };

        let operation = 'createRequest';
        try {
          // Note that this awkward TypeScript conversion exists because the
          // typings for this client fail to accomodate using the newer Promise
          // return type.
          const createRequest = ((await zendeskClient.requests.create(
            zendeskReq
          )) as unknown) as zendesk.Requests.ResponseModel;

          const zenUid = createRequest.requester_id;

          // 3 retries spread out over ~5 seconds
          const retryOptions = {
            retries: 3,
            minTimeout: 500,
            factor: 1.66,
          };

          // Ensure that the user has the appropriate custom fields
          // We use retries here as they're more important for linking the
          // Zendesk user to the fxa uid.
          operation = 'showUser';
          const showRequest = await pRetry(async () => {
            return ((await zendeskClient.users.show(
              zenUid
            )) as unknown) as zendesk.Users.ResponseModel;
          }, retryOptions);
          const userFields = showRequest.user_fields as
            | null
            | undefined
            | Record<string, any>;
          if (!userFields?.user_id || !showRequest.locale) {
            operation = 'updateUser';
            await pRetry(async () => {
              return await zendeskClient.users.update(zenUid, {
                user: {
                  user_fields: { user_id: uid },
                  locale: request.app.locale,
                } as any,
              });
            }, retryOptions);
          }
          return { success: true, ticket: createRequest.id };
        } catch (err) {
          throw error.backendServiceFailure(
            'zendesk',
            operation,
            { uid, email },
            err
          );
        }
      },
    },
  ];
};
