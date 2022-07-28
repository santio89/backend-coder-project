import dotenv from 'dotenv'
dotenv.config()
const {firebaseKey} = JSON.parse(process.env.FIREBASE_PRIVATE_KEY);

export default {
    mongodb: {
        connectionString: process.env.MONGO_CONNECTION_STRING
    }, 
    firebase: {
        "type": "service_account",
        "project_id": "ecommerce-node-coder",
        "private_key_id": process.env.FIREBASE_PRIVATE_KEY_ID,
        "private_key": firebaseKey,
        "client_email": "firebase-adminsdk-oftr8@ecommerce-node-coder.iam.gserviceaccount.com",
        "client_id": "115950707436719859569",
        "auth_uri": "https://accounts.google.com/o/oauth2/auth",
        "token_uri": "https://oauth2.googleapis.com/token",
        "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
        "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-oftr8%40ecommerce-node-coder.iam.gserviceaccount.com"
      }      
}