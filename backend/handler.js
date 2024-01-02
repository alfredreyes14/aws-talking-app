let AWS = require("aws-sdk");
let polly = new AWS.Polly();
let s3 = new AWS.S3();
const { v4: uuidv4 } = require('uuid')

const createOutputFileInS3 = ({ params, bucketName, key, callback }) => {
  s3.putObject(params)
    .on("success", function (response) {
      console.log("S3 Put Success!");
    })
    .on("complete", function () {
      console.log("S3 Put Complete!");
      let s3params = {
        Bucket: bucketName,
        Key: key + '.mp3',
      };
      // 3. Getting a signed URL for the saved mp3 file 
      let url = s3.getSignedUrl("getObject", s3params);
      // Sending the result back to the user
      let result = {
        bucket: bucketName,
        key: key + '.mp3',
        url
      };
      callback(null, {
        statusCode: 200,
        headers: {
          "Access-Control-Allow-Origin" : "*"
        },
        body: JSON.stringify(result)
      });
    })
    .on("error", function (response) {
      console.log(response);
    })
    .send();
}

module.exports.speak = (event, context, callback) => {
  let data = JSON.parse(event.body);
  const pollyParams = {
    OutputFormat: "mp3",
    Text: data.text,
    VoiceId: data.voice
  };
  // 1. Getting the audio stream for the text that user entered
  polly.synthesizeSpeech(pollyParams)
    .on("success", function (response) {
      let data = response.data;
      let audioStream = data.AudioStream;
      let key = uuidv4();
      let bucketName = process.env.BUCKET_NAME;  
      // 2. Saving the audio stream to S3
      let params = {
        Bucket: bucketName,
        Key: key + '.mp3',
        Body: audioStream
      };
      createOutputFileInS3({
        params,
        bucketName,
        key,
        callback
      })
    })
    .on("error", function (err) {
      callback(null, {
        statusCode: 500,
        headers: {
          "Access-Control-Allow-Origin" : "*"
        },
        body: JSON.stringify(err)
      });
    })
    .send();
};