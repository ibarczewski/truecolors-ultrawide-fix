export interface JobNotificationDTO {
    jobName: string;
    buildPhase: 'COMPLETED' | 'FINALIZED' | 'STARTED' | 'QUEUED';
    buildStatus: 'SUCCESS' | 'FAILED';
    buildURL: string;
    buildNumber: number;
}