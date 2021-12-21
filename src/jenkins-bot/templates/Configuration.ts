import { Template } from '../../common/templates/Template';
import { JenkinsAttachmentAction } from '../controllers/JenkinsCardFormController';

interface JenkinsConfigurationData {
  roomId: string;
}

export default class JenkinsConfigurationTemplate
  implements Template<JenkinsConfigurationData>
{
  buildCard(data: JenkinsConfigurationData) {
    return {
      $schema: 'http://adaptivecards.io/schemas/adaptive-card.json',
      type: 'AdaptiveCard',
      version: '1.2',
      body: [
        {
          type: 'TextBlock',
          size: 'Medium',
          weight: 'Bolder',
          text: 'Configure Jenkins Bot',
          horizontalAlignment: 'Center'
        },
        {
          type: 'Input.Text',
          placeholder: 'Room ID',
          style: 'text',
          maxLength: 0,
          id: 'roomId',
          isVisible: false,
          value: data.roomId
        },
        {
          type: 'Input.Text',
          placeholder: 'Jenkins Username',
          maxLength: 0,
          id: 'username'
        },
        {
          type: 'Input.Text',
          placeholder: 'Jenkins API Key',
          maxLength: 0,
          id: 'apiKey'
        },
        {
          type: 'Input.Text',
          placeholder: 'Jenkins URL (e.g., http://localhost:8080/)',
          maxLength: 0,
          id: 'jenkinsUrl'
        }
      ],
      actions: [
        {
          type: 'Action.Submit',
          title: 'Submit',
          data: {
            cardType: 'input',
            id: JenkinsAttachmentAction.SET_JENKINS_CONFIG
          }
        }
      ]
    };
  }
}
