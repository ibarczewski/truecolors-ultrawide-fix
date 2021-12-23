import { Template } from '../../common/templates/Template';
import { JenkinsJobStatus } from '../common/JenkinsJobStatus';
import { JenkinsAttachmentAction } from '../controllers/JenkinsCardFormController';

export interface Commit {
  sha: string;
  author: string;
  authorEmail: string;
  message: string;
}

export interface JobCompletedTemplateData {
  jobName: string;
  jobStatus: JenkinsJobStatus;
  buildNumber: number;
  buildURL: string;
  scm: string;
  scmURL: string;
  numberOfChanges: number;
  commits?: Commit[];
  envelopeId?: string;
  showRetryAction?: boolean;
}

export default class JobCompletedTemplate
  implements Template<JobCompletedTemplateData>
{
  buildCard(data: JobCompletedTemplateData) {
    return {
      type: 'AdaptiveCard',
      body: [
        {
          type: 'Container',
          items: [
            {
              type: 'TextBlock',
              text: data.jobName,
              wrap: true,
              color: 'Light'
            },
            {
              type: 'TextBlock',
              weight: 'Bolder',
              text: `Job COMPLETED ${
                data.jobStatus === JenkinsJobStatus.SUCCESS ? '☀️' : '🌧️'
              }`,
              wrap: true,
              size: 'Large',
              spacing: 'ExtraLarge'
            }
          ],
          spacing: 'None'
        },
        {
          type: 'ColumnSet',
          columns: [
            {
              type: 'Column',
              width: 'auto',
              items: [
                {
                  type: 'TextBlock',
                  text: 'Build number',
                  color: 'Light',
                  spacing: 'None'
                },
                {
                  type: 'TextBlock',
                  text: 'Status',
                  color: 'Light',
                  spacing: 'None'
                }
              ]
            },
            {
              type: 'Column',
              width: 'auto',
              items: [
                {
                  type: 'TextBlock',
                  text: `[${data.buildNumber}](${data.buildURL})`,
                  spacing: 'None'
                },
                {
                  type: 'TextBlock',
                  text: `${data.jobStatus}`,
                  spacing: 'None'
                }
              ]
            }
          ]
        },
        ...(data.scm && data.scmURL
          ? [
              {
                type: 'ColumnSet',
                spacing: 'Small',
                columns: [
                  {
                    type: 'Column',
                    width: 'auto',
                    items: [
                      {
                        type: 'TextBlock',
                        text: 'SCM',
                        color: 'Light'
                      }
                    ]
                  },
                  {
                    type: 'Column',
                    width: 'stretch',
                    items: [
                      {
                        type: 'TextBlock',
                        text: `[${data.scm}](${data.scmURL})`,
                        wrap: true
                      }
                    ]
                  }
                ],
                bleed: true
              }
            ]
          : []),
        ...(data.numberOfChanges !== undefined
          ? [
              {
                type: 'ColumnSet',
                spacing: 'None',
                columns: [
                  {
                    type: 'Column',
                    width: 'auto',
                    items: [
                      {
                        type: 'TextBlock',
                        text: 'Number of changes',
                        wrap: true,
                        color: 'Light'
                      }
                    ]
                  },
                  {
                    type: 'Column',
                    width: 'auto',
                    items: [
                      {
                        type: 'TextBlock',
                        text: `${data.numberOfChanges}`
                      }
                    ]
                  }
                ]
              }
            ]
          : []),
        ...(data.commits
          ? [
              {
                type: 'Container',
                items: [
                  ...data.commits.slice(0, 4).map((commit) => {
                    return {
                      type: 'Container',
                      items: [
                        {
                          type: 'ColumnSet',
                          columns: [
                            {
                              type: 'Column',
                              width: 'auto',
                              items: [
                                {
                                  type: 'TextBlock',
                                  text: `[${commit.sha.substring(0, 7)}](${
                                    data.scmURL
                                  }/commit/${commit.sha})`,
                                  wrap: true
                                }
                              ]
                            },
                            {
                              type: 'Column',
                              width: 'auto',
                              items: [
                                {
                                  type: 'TextBlock',
                                  text: '|',
                                  color: 'light',
                                  horizontalAlignment: 'Center'
                                }
                              ],
                              spacing: 'None'
                            },
                            {
                              type: 'Column',
                              width: 'auto',
                              items: [
                                {
                                  type: 'TextBlock',
                                  text: `[${commit.author}](mailto:${commit.authorEmail})`,
                                  wrap: true
                                }
                              ],
                              spacing: 'None'
                            }
                          ]
                        },
                        {
                          type: 'TextBlock',
                          text: commit.message,
                          wrap: true,
                          spacing: 'None',
                          maxLines: 2
                        }
                      ]
                    };
                  })
                ]
              }
            ]
          : []),
        ...(data.numberOfChanges > 4
          ? [
              {
                type: 'TextBlock',
                text: `...and ${data.numberOfChanges - 4} more`,
                spacing: 'Small',
                size: 'Small'
              }
            ]
          : []),
        {
          type: 'ActionSet',
          spacing: 'None',
          actions: [
            {
              type: 'Action.OpenUrl',
              title: 'Build Details',
              url: data.buildURL
            },
            ...(data.numberOfChanges > 0
              ? [
                  {
                    type: 'Action.OpenUrl',
                    title: 'All Changes',
                    url: `${data.buildURL}changes`
                  }
                ]
              : []),
            ...(data.showRetryAction
              ? [
                  {
                    type: 'Action.Submit',
                    title: 'Retry',
                    data: {
                      id: `${JenkinsAttachmentAction.RETRY_BUILD}`,
                      envelopeId: data.envelopeId,
                      jobName: data.jobName
                    }
                  }
                ]
              : [])
          ]
        }
      ],
      $schema: 'http://adaptivecards.io/schemas/adaptive-card.json',
      version: '1.2'
    };
  }
}
