import { AzureFunction, Context } from "@azure/functions";
const { ServiceBusClient } = require("@azure/service-bus");
import 'dotenv/config'

const serviceBusQueueTrigger: AzureFunction = async function(context: Context, mySbQueueMsg: any): Promise<void> {
   
    context.log('ServiceBus queue trigger function processed message', mySbQueueMsg);

    const serviceBusClient = new ServiceBusClient(process.env.AksServiceBus_SERVICEBUS);

    try {

        const payloadBody = mySbQueueMsg.body || mySbQueueMsg;
        const payload = JSON.parse(payloadBody);
        const payloadType = payload.type;
    
        if(!payloadType) throw new Error("Invalid payload type")
    
        const classifier = {
            label: "Aks-MicroService",
            header: {
                topicArr: []
            },
            data: {...payload}
        }

        switch(payloadType) {
            case "payloadA":
                classifier.header.topicArr = ["topicAlpha", "topicBeta"];
                break;
            case "payloadB":
                classifier.header.topicArr = ["topicBeta", "topicGamma"];
                break;
            default:
                break;
        }

        context.log(classifier);

        const sender = serviceBusClient.createSender(classifier.header.topicArr[0]);

        await sender.sendMessages({body:classifier});

        await sender.close();

    } catch (error) {
        context.log.error(error);
    } finally {
        serviceBusClient.close();
    }


};

export default serviceBusQueueTrigger;
