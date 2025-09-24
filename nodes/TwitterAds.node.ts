import {
    IDataObject,
    INodeExecutionData,
    INodeType,
    INodeTypeDescription,
    NodeOperationError,
    IExecuteFunctions,
} from 'n8n-workflow';

import * as crypto from 'crypto';
const OAuth = require('oauth-1.0a');

export class TwitterAds implements INodeType {
    description: INodeTypeDescription = {
        displayName: 'Twitter Ads',
        name: 'twitterAds',
        icon: 'file:twitter.svg',
        group: ['transform'],
        version: 1,
        description: 'Create and manage Twitter Ads campaigns with follower targeting',
        defaults: {
            name: 'Twitter Ads',
        },
        inputs: ['main'],
        outputs: ['main'],
        credentials: [
            {
                name: 'twitterAdsApi',
                required: true,
            },
        ],
        properties: [
            {
                displayName: 'Resource',
                name: 'resource',
                type: 'options',
                noDataExpression: true,
                options: [
                    {
                        name: 'Campaign',
                        value: 'campaign',
                    },
                    {
                        name: 'Line Item',
                        value: 'lineItem',
                    },
                    {
                        name: 'Targeting',
                        value: 'targeting',
                    },
                    {
                        name: 'Analytics',
                        value: 'analytics',
                    },
                ],
                default: 'campaign',
            },

            // Campaign operations
            {
                displayName: 'Operation',
                name: 'operation',
                type: 'options',
                noDataExpression: true,
                displayOptions: {
                    show: {
                        resource: ['campaign'],
                    },
                },
                options: [
                    {
                        name: 'Create',
                        value: 'create',
                        description: 'Create a new campaign',
                    },
                    {
                        name: 'Get',
                        value: 'get',
                        description: 'Get a campaign',
                    },
                    {
                        name: 'Update',
                        value: 'update',
                        description: 'Update a campaign',
                    },
                ],
                default: 'create',
            },

            // Campaign Create fields
            {
                displayName: 'Name',
                name: 'name',
                type: 'string',
                required: true,
                displayOptions: {
                    show: {
                        resource: ['campaign'],
                        operation: ['create'],
                    },
                },
                default: '',
                description: 'Name for the campaign',
            },
            {
                displayName: 'Funding Instrument ID',
                name: 'fundingInstrumentId',
                type: 'string',
                required: true,
                displayOptions: {
                    show: {
                        resource: ['campaign'],
                        operation: ['create'],
                    },
                },
                default: '',
                description: 'ID of the funding instrument to use',
            },
            {
                displayName: 'Daily Budget',
                name: 'dailyBudget',
                type: 'number',
                required: true,
                displayOptions: {
                    show: {
                        resource: ['campaign'],
                        operation: ['create'],
                    },
                },
                default: 50,
                description: 'Daily budget amount in account currency',
            },
            {
                displayName: 'Start Time',
                name: 'startTime',
                type: 'dateTime',
                required: true,
                displayOptions: {
                    show: {
                        resource: ['campaign'],
                        operation: ['create'],
                    },
                },
                default: '',
                description: 'Start time for the campaign',
            },

            // Line Item operations
            {
                displayName: 'Operation',
                name: 'operation',
                type: 'options',
                noDataExpression: true,
                displayOptions: {
                    show: {
                        resource: ['lineItem'],
                    },
                },
                options: [
                    {
                        name: 'Create',
                        value: 'create',
                        description: 'Create a new line item',
                    },
                    {
                        name: 'Update',
                        value: 'update',
                        description: 'Update a line item',
                    },
                ],
                default: 'create',
            },

            // Line Item fields
            {
                displayName: 'Campaign ID',
                name: 'campaignId',
                type: 'string',
                required: true,
                displayOptions: {
                    show: {
                        resource: ['lineItem'],
                        operation: ['create'],
                    },
                },
                default: '',
                description: 'ID of the campaign',
            },
            {
                displayName: 'Line Item Name',
                name: 'lineItemName',
                type: 'string',
                required: true,
                displayOptions: {
                    show: {
                        resource: ['lineItem'],
                        operation: ['create'],
                    },
                },
                default: '',
                description: 'Name for the line item',
            },
            {
                displayName: 'Objective',
                name: 'objective',
                type: 'options',
                required: true,
                displayOptions: {
                    show: {
                        resource: ['lineItem'],
                        operation: ['create'],
                    },
                },
                options: [
                    {
                        name: 'Website Clicks',
                        value: 'WEBSITE_CLICKS',
                    },
                    {
                        name: 'Tweet Engagements',
                        value: 'TWEET_ENGAGEMENTS',
                    },
                    {
                        name: 'Followers',
                        value: 'FOLLOWERS',
                    },
                ],
                default: 'WEBSITE_CLICKS',
            },

            // Targeting operations
            {
                displayName: 'Operation',
                name: 'operation',
                type: 'options',
                noDataExpression: true,
                displayOptions: {
                    show: {
                        resource: ['targeting'],
                    },
                },
                options: [
                    {
                        name: 'Add Follower Targeting',
                        value: 'addFollowers',
                        description: 'Target followers of specific accounts',
                    },
                ],
                default: 'addFollowers',
            },

            // Targeting fields
            {
                displayName: 'Line Item ID',
                name: 'lineItemId',
                type: 'string',
                required: true,
                displayOptions: {
                    show: {
                        resource: ['targeting'],
                    },
                },
                default: '',
                description: 'ID of the line item to add targeting to',
            },
            {
                displayName: 'Target Accounts',
                name: 'targetAccounts',
                type: 'string',
                required: true,
                displayOptions: {
                    show: {
                        resource: ['targeting'],
                        operation: ['addFollowers'],
                    },
                },
                default: '',
                description: 'Comma-separated list of Twitter usernames (without @)',
            },

            // Analytics operations
            {
                displayName: 'Operation',
                name: 'operation',
                type: 'options',
                noDataExpression: true,
                displayOptions: {
                    show: {
                        resource: ['analytics'],
                    },
                },
                options: [
                    {
                        name: 'Get Stats',
                        value: 'getStats',
                        description: 'Get performance metrics',
                    },
                ],
                default: 'getStats',
            },

            // Analytics fields
            {
                displayName: 'Entity Type',
                name: 'entityType',
                type: 'options',
                required: true,
                displayOptions: {
                    show: {
                        resource: ['analytics'],
                        operation: ['getStats'],
                    },
                },
                options: [
                    {
                        name: 'Campaign',
                        value: 'CAMPAIGN',
                    },
                    {
                        name: 'Line Item',
                        value: 'LINE_ITEM',
                    },
                ],
                default: 'LINE_ITEM',
            },
            {
                displayName: 'Entity IDs',
                name: 'entityIds',
                type: 'string',
                required: true,
                displayOptions: {
                    show: {
                        resource: ['analytics'],
                    },
                },
                default: '',
                description: 'Comma-separated list of entity IDs',
            },
        ],
    };

    async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
        const items = this.getInputData();
        const returnData: INodeExecutionData[] = [];

        const credentials = await this.getCredentials('twitterAdsApi');
        const accountId = credentials.accountId as string;
        const baseUrl = 'https://ads-api.twitter.com/12';

        // Initialize OAuth
        const oauth = new OAuth({
            consumer: {
                key: credentials.consumerKey as string,
                secret: credentials.consumerSecret as string,
            },
            signature_method: 'HMAC-SHA1',
            hash_function(base_string: string, key: string) {
                return crypto.createHmac('sha1', key).update(base_string).digest('base64');
            },
        });

        const makeRequest = async (method: string, url: string, body?: IDataObject) => {
            const token = {
                key: credentials.accessToken as string,
                secret: credentials.accessTokenSecret as string,
            };

            const requestData: any = {
                url,
                method,
            };

            if (body) {
                requestData.data = body;
            }

            const authHeader = oauth.toHeader(oauth.authorize(requestData, token));

            const options: any = {
                method,
                url,
                headers: {
                    ...authHeader,
                    'Content-Type': 'application/json',
                },
                json: true,
            };

            if (body) {
                options.body = body;
            }

            try {
                return await this.helpers.httpRequest(options);
            } catch (error: any) {
                throw new NodeOperationError(this.getNode(), `Twitter Ads API Error: ${error.message}`);
            }
        };

        for (let i = 0; i < items.length; i++) {
            try {
                const resource = this.getNodeParameter('resource', i) as string;
                const operation = this.getNodeParameter('operation', i) as string;
                let responseData;

                if (resource === 'campaign') {
                    if (operation === 'create') {
                        const name = this.getNodeParameter('name', i) as string;
                        const fundingInstrumentId = this.getNodeParameter('fundingInstrumentId', i) as string;
                        const dailyBudget = this.getNodeParameter('dailyBudget', i) as number;
                        const startTime = this.getNodeParameter('startTime', i) as string;

                        const body: IDataObject = {
                            name,
                            funding_instrument_id: fundingInstrumentId,
                            daily_budget_amount_local_micro: (dailyBudget * 1000000).toString(),
                            start_time: new Date(startTime).toISOString(),
                            entity_status: 'PAUSED',
                        };

                        responseData = await makeRequest('POST', `${baseUrl}/accounts/${accountId}/campaigns`, body);
                    }
                } else if (resource === 'lineItem') {
                    if (operation === 'create') {
                        const campaignId = this.getNodeParameter('campaignId', i) as string;
                        const name = this.getNodeParameter('lineItemName', i) as string;
                        const objective = this.getNodeParameter('objective', i) as string;

                        const body: IDataObject = {
                            campaign_id: campaignId,
                            name,
                            product_type: 'PROMOTED_TWEETS',
                            placements: ['ALL_ON_TWITTER'],
                            objective,
                            bid_amount_local_micro: '1000000',
                            entity_status: 'PAUSED',
                        };

                        responseData = await makeRequest('POST', `${baseUrl}/accounts/${accountId}/line_items`, body);
                    }
                } else if (resource === 'targeting') {
                    if (operation === 'addFollowers') {
                        const lineItemId = this.getNodeParameter('lineItemId', i) as string;
                        const targetAccounts = this.getNodeParameter('targetAccounts', i) as string;
                        const accounts = targetAccounts.split(',').map(a => a.trim());

                        const responses = [];
                        for (const account of accounts) {
                            const body: IDataObject = {
                                line_item_id: lineItemId,
                                targeting_type: 'SIMILAR_TO_FOLLOWERS',
                                targeting_value: account,
                            };

                            const response = await makeRequest('POST', `${baseUrl}/accounts/${accountId}/targeting_criteria`, body);
                            responses.push(response);
                        }
                        responseData = { data: responses };
                    }
                } else if (resource === 'analytics') {
                    if (operation === 'getStats') {
                        const entityType = this.getNodeParameter('entityType', i) as string;
                        const entityIds = this.getNodeParameter('entityIds', i) as string;

                        const url = `${baseUrl}/stats/accounts/${accountId}?entity=${entityType}&entity_ids=${entityIds}&metric_groups=ENGAGEMENT&granularity=TOTAL&placement=ALL_ON_TWITTER`;
                        responseData = await makeRequest('GET', url);
                    }
                }

                returnData.push({ json: responseData || {} });
            } catch (error: any) {
                if (this.continueOnFail()) {
                    returnData.push({ json: { error: error.message } });
                    continue;
                }
                throw error;
            }
        }

        return [returnData];
    }
}