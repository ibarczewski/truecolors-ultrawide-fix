import { BaseCard } from './BaseCard';

export type IssueAssignedNotificationData = {
  repositoryName: string;
  repositoryURL: string;
  assigneeName: string;
  assigneeURL: string;
  assignedByName: string;
  assignedByURL: string;
  issueNumber: number;
  issueTitle: string;
  issueURL: string;
};

export class IssueAssignedNotification extends BaseCard<IssueAssignedNotificationData> {
  protected static template = {
    type: 'AdaptiveCard',
    body: [
      {
        type: 'ColumnSet',
        columns: [
          {
            type: 'Column',
            items: [
              {
                type: 'TextBlock',
                text: `[{{repositoryName}}]({{repositoryURL}})`,
                weight: 'Lighter',
                color: 'Accent'
              },
              {
                type: 'TextBlock',
                weight: 'Bolder',
                text: `Issue assigned to [{{assigneeName}}]({{assigneeURL}})`,
                wrap: true,
                color: 'Light',
                size: 'Large',
                spacing: 'Small'
              }
            ],
            width: 'stretch'
          }
        ]
      },
      {
        type: 'ColumnSet',
        columns: [
          {
            type: 'Column',
            width: 35,
            items: [
              {
                type: 'TextBlock',
                text: 'Assigned by:',
                color: 'Light'
              },
              {
                type: 'TextBlock',
                text: 'Issue:',
                weight: 'Lighter',
                color: 'Light',
                spacing: 'Small'
              }
            ]
          },
          {
            type: 'Column',
            width: 65,
            items: [
              {
                type: 'TextBlock',
                text: `[{{assignedByName}}]({{assignedByURL}})`,
                color: 'Light'
              },
              {
                type: 'TextBlock',
                text: `[#{{issueNumber}} - {{issueTitle}}]({{issueURL}})`,
                color: 'Light',
                weight: 'Lighter',
                spacing: 'Small'
              }
            ]
          }
        ],
        spacing: 'Padding',
        horizontalAlignment: 'Center'
      }
    ],
    $schema: 'http://adaptivecards.io/schemas/adaptive-card.json',
    version: '1.2'
  };
}
