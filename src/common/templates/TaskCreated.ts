import { Template } from './Template';

export type Metadata = {
  key: string;
  value: string;
};

export type Action = {
  type: string;
  title: string;
  url: string;
};

export type TaskCreatedTemplateData = {
  projectName: string;
  title: string;
  metadata: Metadata[];
  actions?: Action[];
};

export const taskCreatedTemplate: Template<TaskCreatedTemplateData> = (
  data
) => {
  const metadataTable = data.metadata.reduce(
    (previousRows, { key, value }, index) => {
      const metadataTemplate = {
        type: 'TextBlock',
        color: 'Light',
        ...(index > 0 && { spacing: 'Small' })
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
                weight: 'Lighter',
                color: 'Accent'
              },
              {
                type: 'TextBlock',
                weight: 'Bolder',
                text: data.title,
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
      ...(data.metadata.length > 0 && [
        {
          type: 'ColumnSet',
          columns: [
            {
              type: 'Column',
              width: 35,
              items: metadataTable.leftSide
            },
            {
              type: 'Column',
              width: 65,
              items: metadataTable.rightSide
            }
          ],
          spacing: 'Padding',
          horizontalAlignment: 'Center'
        }
      ]),
      ...(data.actions?.length > 0
        ? [
            {
              type: 'ActionSet',
              actions: data.actions.map(({ type, title, url }) => ({
                type,
                title,
                url
              }))
            }
          ]
        : [])
    ],
    $schema: 'http://adaptivecards.io/schemas/adaptive-card.json',
    version: '1.2'
  };

  return card;
};
