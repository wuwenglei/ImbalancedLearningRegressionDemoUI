interface ResamplingMethodName {
    ro : string,
    uo : string
}

const resamplingMethodNames : ResamplingMethodName = {
    ro: 'Random Oversampling',
    uo: 'Random Undersampling'
}

const oversamplingMethods : string[] = ['ro']
const undersamplingMethods : string[] = ['uo']

interface TaskStatusSnsTopicSubscriptionOptionName {
    accept : string,
    subscribed : string,
    reject : string
}

const taskStatusSnsTopicSubscriptionOptionNames : TaskStatusSnsTopicSubscriptionOptionName = {
    accept: 'Subscribe task status notification.',
    subscribed: 'This email has subscribed before. Skip now.',
    reject: 'Deny subscription and notification.'
}

const getResamplingMethodKeys = (oversampling : boolean = true) : string[] => oversampling ? oversamplingMethods : undersamplingMethods

const getResamplingMethodName = (method : string) : string => resamplingMethodNames[method as keyof ResamplingMethodName] || ''

const getTaskStatusSnsTopicSubscriptionOptionKeys = () : string[] => Object.keys(taskStatusSnsTopicSubscriptionOptionNames)

const getTaskStatusSnsTopicSubscriptionOptionName = (option : string) : string => taskStatusSnsTopicSubscriptionOptionNames[option as keyof TaskStatusSnsTopicSubscriptionOptionName] || ''

interface ChartDataPoint {
    name : string,
    Raw : number,
    Resampled : number
  }
  
  interface RequestRecord {
    requestId : string,
    email : string,
    method : string,
    y : string,
    chartDataSize : number,
    chartLabelCount : number,
    chartDataPoints : Array<ChartDataPoint> | null,
    taskStatusSnsTopicArn : string,
    taskStatusSnsTopicSubscriptionOption : string,
    taskStatusSnsTopicSubscriptionArn : string | null,
    onResampleStartSnsPublishMessageId : string | null,
    onResampleCompleteSnsPublishMessageId : string | null,
    onResampleFailSnsPublishMessageId : string | null,
    originalFileName : string,
    originalFileNameSuffix : string,
    s3RawDataBucketName : string,
    s3RawDataObjectKey : string,
    s3RawDataFileName : string,
    s3ResampledDataBucketName : string,
    s3ResampledDataObjectKey : string,
    s3ResampledDataFileName : string,
    recordCreationTime : number,
    recordExpirationTime : number,
    resamplingStartTime : number | null,
    resamplingEndTime : number | null,
    getPresignedUrlRaw : string | null,
    getPresignedUrlResampled : string | null
  }
  
  const currentTime : number = new Date().getTime()
  
  const requestRecordDefaultValues = {
    requestId : '',
    email : '',
    method : '',
    y : '',
    chartDataSize : 200,
    chartLabelCount : 5,
    chartDataPoints : null,
    taskStatusSnsTopicArn : '',
    taskStatusSnsTopicSubscriptionOption : '',
    taskStatusSnsTopicSubscriptionArn : null,
    onResampleStartSnsPublishMessageId : null,
    onResampleCompleteSnsPublishMessageId : null,
    onResampleFailSnsPublishMessageId : null,
    originalFileName : '',
    originalFileNameSuffix : '',
    s3RawDataBucketName : '',
    s3RawDataObjectKey : '',
    s3RawDataFileName : '',
    s3ResampledDataBucketName : '',
    s3ResampledDataObjectKey : '',
    s3ResampledDataFileName : '',
    recordCreationTime : currentTime,
    recordExpirationTime : currentTime + 604800,
    resamplingStartTime : null,
    resamplingEndTime : null,
    getPresignedUrlRaw : null,
    getPresignedUrlResampled : null
  }

export { getResamplingMethodKeys, getResamplingMethodName, getTaskStatusSnsTopicSubscriptionOptionKeys, getTaskStatusSnsTopicSubscriptionOptionName, requestRecordDefaultValues }
export type { RequestRecord }

