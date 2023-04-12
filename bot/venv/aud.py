from twilio.rest import Client

# Your Twilio account SID and auth token
account_sid = 'ACaa1199efc4341ecebb196e23d8049cb3'
auth_token = '1233ffd9af52159d5654ecd8215ad829'

# Create a Twilio client
client = Client(account_sid, auth_token)

# Make a phone call
call = client.calls.create(
    to='+919003313151',  # The phone number you want to call
    from_='+15074146909',  # Your Twilio phone number
    url='http://demo.twilio.com/docs/classic.mp3'  # A TwiML URL that specifies how to handle the call
)
print(call.sid)  # Print the call SID to confirm that the call was made
