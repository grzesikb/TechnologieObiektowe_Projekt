import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore

# Inicjalizacja Firebase Admin SDK
cred = credentials.Certificate('/Users/pwgawzynski/Downloads/Evento-BE/Eventobe/evento-f8ada-firebase-adminsdk-1qswp-d03f58514a.json')
firebase_admin.initialize_app(cred, {
    'databaseURL':'https://9r6nFRb5fM05Uqrv54HH.firebaseio.com'
})

db = firestore.client()