const { SendEmailCommand } =require( "@aws-sdk/client-ses");
const { sesClient } = require ("./sesClient.js");

const createSendEmailCommand = (toAddress, fromAddress,subject,body,bccAddresses) => {

    return new SendEmailCommand({
      Destination: {
        CcAddresses: [
        ],
        ToAddresses: [
          toAddress,
          
          /* more To-email addresses */
        ],
        BccAddresses: [
          bccAddresses,
          
          /* more To-email addresses */
        ],
      },
      Message: {
        /* required */ 
        Body: {
          /* required */
          Html: {
            Charset: "UTF-8",
            Data: ` ${body }
            <h5>For More visit : https://devcircle.site</h5>`,
          },
          Text: {
            Charset: "UTF-8",
            Data: "This is text data", 
          }, 
        },
        Subject: {
          Charset: "UTF-8",
          Data: subject,
        },
      },
      Source: fromAddress,
      ReplyToAddresses: [
        /* more items */
      ],
    });
  };
  
  const run = async (subject,body,touserEmailId) => {
    
    const toAddresses = [touserEmailId]; // Add multiple recipients
    const bccAddresses = ["keshavks9810@gmail.com"]; // Add multiple recipients
   
    const sendEmailCommand = createSendEmailCommand(
      toAddresses,
      "support@devcircle.site",
      subject,
      body,
      bccAddresses,
    );
  
    try {
      return await sesClient.send(sendEmailCommand);
    } catch (caught) {
      if (caught instanceof Error && caught.name === "MessageRejected") {
        /** @type { import('@aws-sdk/client-ses').MessageRejected} */
        const messageRejectedError = caught;
        return messageRejectedError;
      }
      throw caught;
    }
  };
  
// snippet-end:[ses.JavaScript.email.sendEmailV3]
module.exports =  {run} ;