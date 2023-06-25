import { AzureFunction, Context } from "@azure/functions"

const serviceBusQueueTrigger: AzureFunction = async function(context: Context, mySbQueueMsg: any): Promise<void> {
    context.log('ServiceBus queue trigger function processed message', mySbQueueMsg);
};

export default serviceBusQueueTrigger;
