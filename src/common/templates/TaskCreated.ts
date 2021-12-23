import { Template } from './Template';

export type Metadata = {
  key: string;
  value: string;
};

export type SubmitAction = {
  type: string;
  title: string;
  data: any;
};

export type OpenUrlAction = {
  type: string;
  title: string;
  url: string;
};

export type TaskCreatedTemplateData = {
  projectName: string;
  title: string;
  metadata: Metadata[];
  actions?: (OpenUrlAction | SubmitAction)[];
};
export class TaskCreatedTemplate implements Template<TaskCreatedTemplateData> {
  public buildCard(data: TaskCreatedTemplateData) {
    const metadataTable = data.metadata.reduce(
      (previousRows, { key, value }, index) => {
        const metadataTemplate = {
          type: 'TextBlock',
          color: 'Light',
          ...(index > 0 && { spacing: 'None' })
        };

        previousRows.leftSide.push({ ...metadataTemplate, text: key });
        previousRows.rightSide.push({ ...metadataTemplate, text: value });
        return previousRows;
      },
      { leftSide: [], rightSide: [] }
    );

    const card = {
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
                  text: data.projectName,
                  wrap: true,
                  color: 'Light'
                },
                {
                  type: 'TextBlock',
                  weight: 'Bolder',
                  text: data.title,
                  wrap: true,
                  size: 'Large',
                  spacing: 'ExtraLarge'
                }
              ],
              width: 'stretch'
            }
          ]
        },
        ...(data.metadata.length > 0 && [
          {
            type: 'ColumnSet',
            columns: [
              {
                type: 'Column',
                width: 'auto',
                items: metadataTable.leftSide
              },
              {
                type: 'Column',
                width: 'auto',
                items: metadataTable.rightSide
              }
            ],
            spacing: 'Padding',
            horizontalAlignment: 'Left'
          }
        ]),
        ...(data.actions
          ? [
              {
                type: 'ActionSet',
                actions: data.actions
              }
            ]
          : [])
      ],
      $schema: 'http://adaptivecards.io/schemas/adaptive-card.json',
      version: '1.2'
    };

    return card;
  }
}
