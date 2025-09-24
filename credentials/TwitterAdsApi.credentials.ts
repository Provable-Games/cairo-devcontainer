import {
    ICredentialType,
    INodeProperties,
} from 'n8n-workflow';

export class TwitterAdsApi implements ICredentialType {
    name = 'twitterAdsApi';
    displayName = 'Twitter Ads API';
    properties: INodeProperties[] = [
        {
            displayName: 'Consumer Key',
            name: 'consumerKey',
            type: 'string',
            default: '',
            required: true,
        },
        {
            displayName: 'Consumer Secret',
            name: 'consumerSecret',
            type: 'string',
            typeOptions: { password: true },
            default: '',
            required: true,
        },
        {
            displayName: 'Access Token',
            name: 'accessToken',
            type: 'string',
            default: '',
            required: true,
        },
        {
            displayName: 'Access Token Secret',
            name: 'accessTokenSecret',
            type: 'string',
            typeOptions: { password: true },
            default: '',
            required: true,
        },
        {
            displayName: 'Account ID',
            name: 'accountId',
            type: 'string',
            default: '',
            required: true,
            description: 'Twitter Ads account ID',
        },
    ];
}